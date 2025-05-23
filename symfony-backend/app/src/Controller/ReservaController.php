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

        // Validar mayor de edad
        $fechaNacimiento = new \DateTime($data['fechaNacimiento']);
        $edad = $fechaNacimiento->diff(new \DateTime())->y;
        if ($edad < 18) {
            return $this->json(['error' => 'Debes ser mayor de edad para hacer una reserva'], 400);
        }

        // Crear la reserva principal
        $reserva = new Reserva();
        $reserva->setNombre($data['nombre']);
        $reserva->setApellidos($data['apellidos']);
        $reserva->setFechaNacimiento($fechaNacimiento);
        $reserva->setEmail($data['email']);
        $reserva->setTelefono($data['telefono']);
        $reserva->setFechaVisita(new \DateTime($data['fechaVisita']));
        $reserva->setFechaReserva(new \DateTime());
        $reserva->setAceptoCondiciones($data['aceptoCondiciones'] ?? false);

        foreach ($data['tickets'] as $ticket) {
            $tipo = $em->getRepository(TicketType::class)->find($ticket['id']);
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
