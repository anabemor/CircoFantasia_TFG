<?php

namespace App\Controller\Admin;

use App\Entity\Reserva;
use App\Entity\TicketType;
use App\Entity\ReservaTicket;
use App\Repository\ReservaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/admin/reservas')]
class ReservaAdminController extends AbstractController
{
    #[Route('', name: 'admin_reservas_list', methods: ['GET'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $fechaInicio = $request->query->get('fechaInicio');
        $fechaFin = $request->query->get('fechaFin');

        $qb = $em->getRepository(Reserva::class)->createQueryBuilder('r');

        if ($fechaInicio) {
            $inicio = \DateTime::createFromFormat('d-m-Y', $fechaInicio);
            if ($inicio) {
                $qb->andWhere('r.fechaVisita >= :inicio')
                   ->setParameter('inicio', $inicio->format('Y-m-d'));
            }
        }

        if ($fechaFin) {
            $fin = \DateTime::createFromFormat('d-m-Y', $fechaFin);
            if ($fin) {
                $qb->andWhere('r.fechaVisita <= :fin')
                   ->setParameter('fin', $fin->format('Y-m-d'));
            }
        }

        $reservas = $qb->getQuery()->getResult();

        $data = array_map(function ($reserva) {
            return [
                'id' => $reserva->getId(),
                'nombre' => $reserva->getNombre(),
                'apellidos' => $reserva->getApellidos(),
                'email' => $reserva->getEmail(),
                'telefono' => $reserva->getTelefono(),
                'fechaNacimiento' => $reserva->getFechaNacimiento()?->format('Y-m-d'),
                'fechaVisita' => $reserva->getFechaVisita()?->format('Y-m-d'),
                'fechaReserva' => $reserva->getFechaReserva()?->format('Y-m-d H:i:s'),
                'aceptoCondiciones' => $reserva->isAceptoCondiciones(),
                'estado' => $reserva->getEstado(),
                'tickets' => array_map(function ($rt) {
                    return [
                        'id' => $rt->getId(),
                        'cantidad' => $rt->getCantidad(),
                        'ticketType' => [
                            'id' => $rt->getTicketType()->getId(),
                            'nombre' => $rt->getTicketType()->getNombre(),
                            'precio' => $rt->getTicketType()->getPrecio(),
                        ],
                    ];
                }, $reserva->getReservaTickets()->toArray())
            ];
        }, $reservas);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'admin_reserva_show', methods: ['GET'])]
    public function show(Reserva $reserva): JsonResponse
    {
        $tickets = [];
        foreach ($reserva->getReservaTickets() as $rt) {
            $tickets[] = [
                'id' => $rt->getId(),
                'cantidad' => $rt->getCantidad(),
                'ticketType' => [
                    'id' => $rt->getTicketType()->getId(),
                    'nombre' => $rt->getTicketType()->getNombre(),
                    'precio' => $rt->getTicketType()->getPrecio()
                ]
            ];
        }

        return $this->json([
            'id' => $reserva->getId(),
            'nombre' => $reserva->getNombre(),
            'apellidos' => $reserva->getApellidos(),
            'fechaNacimiento' => $reserva->getFechaNacimiento()->format('Y-m-d'),
            'email' => $reserva->getEmail(),
            'telefono' => $reserva->getTelefono(),
            'fechaVisita' => $reserva->getFechaVisita()->format('Y-m-d'),
            'fechaReserva' => $reserva->getFechaReserva()->format('Y-m-d H:i:s'),
            'aceptoCondiciones' => $reserva->isAceptoCondiciones(),
            'estado' => $reserva->getEstado(),
            'tickets' => $tickets
        ]);
    }

    #[Route('/crear', name: 'admin_reserva_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['tickets']) || !is_array($data['tickets'])) {
            return $this->json(['error' => 'Datos de reserva incompletos o incorrectos'], 400);
        }

        $fechaVisita = new \DateTime($data['fechaVisita']);
        $reservasEseDia = $em->getRepository(Reserva::class)->findBy(['fechaVisita' => $fechaVisita]);

        $aforoActual = 0;
        foreach ($reservasEseDia as $reservaExistente) {
            foreach ($reservaExistente->getReservaTickets() as $ticket) {
                $aforoActual += $ticket->getCantidad();
            }
        }

        $aforoNuevo = 0;
        foreach ($data['tickets'] as $ticket) {
            $aforoNuevo += $ticket['cantidad'] ?? 0;
        }

        if (($aforoActual + $aforoNuevo) > 60) {
            return $this->json([
                'error' => 'No hay suficientes plazas disponibles para esa fecha. Aforo completo.'
            ], 400);
        }

        $reserva = new Reserva();
        $reserva->setNombre($data['nombre']);
        $reserva->setApellidos($data['apellidos']);
        $reserva->setFechaNacimiento(new \DateTime($data['fechaNacimiento']));
        $reserva->setEmail($data['email']);
        $reserva->setTelefono($data['telefono']);
        $reserva->setFechaVisita($fechaVisita);
        $reserva->setFechaReserva(new \DateTime());
        $reserva->setAceptoCondiciones(true);
        $reserva->setEstado('pendiente');

        foreach ($data['tickets'] as $ticketData) {
            $ticketType = $em->getRepository(TicketType::class)->find($ticketData['ticketType']['id']);
            if (!$ticketType) continue;

            $rt = new ReservaTicket();
            $rt->setTicketType($ticketType);
            $rt->setCantidad($ticketData['cantidad']);
            $reserva->addReservaTicket($rt);
        }

        $em->persist($reserva);
        $em->flush();

        return $this->json(['message' => 'Reserva creada correctamente desde admin'], 201);
    }

    #[Route('/{id}', name: 'admin_reserva_update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $reserva = $em->getRepository(Reserva::class)->find($id);

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        $reserva->setNombre($data['nombre']);
        $reserva->setApellidos($data['apellidos']);
        $reserva->setFechaNacimiento(new \DateTime($data['fechaNacimiento']));
        $reserva->setEmail($data['email']);
        $reserva->setTelefono($data['telefono']);
        $reserva->setFechaVisita(new \DateTime($data['fechaVisita']));
        if (array_key_exists('aceptoCondiciones', $data)) {
            $reserva->setAceptoCondiciones($data['aceptoCondiciones']);
        }
        $reserva->setEstado($data['estado'] ?? $reserva->getEstado());

        foreach ($reserva->getReservaTickets() as $rt) {
            $em->remove($rt);
        }

        foreach ($data['tickets'] as $ticketData) {
            $ticketType = $em->getRepository(TicketType::class)->find($ticketData['ticketType']['id']);
            if (!$ticketType) continue;

            $rt = new ReservaTicket();
            $rt->setTicketType($ticketType);
            $rt->setCantidad($ticketData['cantidad']);
            $reserva->addReservaTicket($rt);
        }

        $em->flush();

        return $this->json(['message' => 'Reserva actualizada']);
    }

    #[Route('/{id}', name: 'admin_reserva_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $reserva = $em->getRepository(Reserva::class)->find($id);

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        $em->remove($reserva);
        $em->flush();

        return $this->json(['message' => 'Reserva eliminada']);
    }
}
