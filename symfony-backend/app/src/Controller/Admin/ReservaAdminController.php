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
    public function index(ReservaRepository $reservaRepository): JsonResponse
    {
        $reservas = $reservaRepository->findAll();
        $data = [];

        foreach ($reservas as $reserva) {
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

            $data[] = [
                'id' => $reserva->getId(),
                'nombre' => $reserva->getNombre(),
                'apellidos' => $reserva->getApellidos(),
                'fechaNacimiento' => $reserva->getFechaNacimiento()->format('Y-m-d'),
                'email' => $reserva->getEmail(),
                'telefono' => $reserva->getTelefono(),
                'fechaVisita' => $reserva->getFechaVisita()->format('Y-m-d'),
                'fechaReserva' => $reserva->getFechaReserva()->format('Y-m-d H:i:s'),
                'aceptoCondiciones' => $reserva->getAceptoCondiciones(),
                'tickets' => $tickets
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'admin_reserva_show', methods: ['GET'])]
    public function show(Reserva $reserva): JsonResponse
    {
        // igual que en index pero solo para 1
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
            'aceptoCondiciones' => $reserva->getAceptoCondiciones(),
            'tickets' => $tickets
        ]);
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
        $reserva->setAceptoCondiciones($data['aceptoCondiciones']);

        // Eliminar tickets actuales
        foreach ($reserva->getReservaTickets() as $rt) {
            $em->remove($rt);
        }

        // Añadir tickets nuevos
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
