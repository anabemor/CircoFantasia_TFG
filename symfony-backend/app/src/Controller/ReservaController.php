<?php

namespace App\Controller;

use App\Entity\Reserva;
use App\Entity\ReservaTicket;
use App\Entity\TicketType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/reservas')]
class ReservaController extends AbstractController
{
    #[Route('', name: 'crear_reserva', methods: ['POST'])]
    public function crearReserva(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['tickets']) || !is_array($data['tickets'])) {
            return $this->json(['error' => 'Datos de reserva incompletos o incorrectos'], 400);
        }

        // Validar edad mínima
        $fechaNacimiento = new \DateTime($data['fechaNacimiento']);
        $edad = $fechaNacimiento->diff(new \DateTime())->y;
        if ($edad < 18) {
            return $this->json(['error' => 'Debes ser mayor de edad para hacer una reserva'], 400);
        }

        // Validación de aforo
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

        // Crear reserva
        $reserva = new Reserva();
        $reserva->setNombre($data['nombre']);
        $reserva->setApellidos($data['apellidos']);
        $reserva->setFechaNacimiento($fechaNacimiento);
        $reserva->setEmail($data['email']);
        $reserva->setTelefono($data['telefono']);
        $reserva->setFechaVisita($fechaVisita);
        $reserva->setFechaReserva(new \DateTime());
        $reserva->setAceptoCondiciones($data['aceptoCondiciones'] ?? false);

        foreach ($data['tickets'] as $ticket) {
            if (!isset($ticket['ticketType']['id'], $ticket['cantidad'])) continue;

            $tipo = $em->getRepository(TicketType::class)->find($ticket['ticketType']['id']);
            if (!$tipo) continue;

            $reservaTicket = new ReservaTicket();
            $reservaTicket->setTicketType($tipo);
            $reservaTicket->setCantidad($ticket['cantidad']);
            $reserva->addReservaTicket($reservaTicket);
        }

        $em->persist($reserva);
        $em->flush();

        return $this->json(['message' => 'Reserva creada correctamente'], 201);
    }

    #[Route('/aforo/{fecha}', name: 'consultar_aforo', methods: ['GET'])]
    public function consultarAforo(string $fecha, EntityManagerInterface $em): JsonResponse
    {
        $fechaObj = new \DateTime($fecha);
        $reservas = $em->getRepository(Reserva::class)->findBy(['fechaVisita' => $fechaObj]);

        $total = 0;
        foreach ($reservas as $reserva) {
            foreach ($reserva->getReservaTickets() as $ticket) {
                $total += $ticket->getCantidad();
            }
        }

        return $this->json([
            'fecha' => $fechaObj->format('Y-m-d'),
            'ocupado' => $total,
            'disponible' => max(0, 60 - $total)
        ]);
    }
}
