<?php

namespace App\Controller;

use App\Entity\TicketType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/ticket_types')]
class TicketTypeController extends AbstractController
{
    #[Route('', name: 'get_ticket_types', methods: ['GET'])]
    public function getTiposTicket(EntityManagerInterface $em): JsonResponse
    {
        $tipos = $em->getRepository(TicketType::class)->findAll();

        $data = array_map(function (TicketType $tipo) {
            return [
                'id' => $tipo->getId(),
                'nombre' => $tipo->getNombre(),
                'precio' => $tipo->getPrecio(),
                'activo' => $tipo->isActivo(),
            ];
        }, $tipos);

        return $this->json($data);
    }

     #[Route('', name: 'create_ticket_type', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['nombre']) || !isset($data['precio'])) {
            return $this->json(['error' => 'Datos incompletos'], 400);
        }

        $ticketType = new TicketType();
        $ticketType->setNombre($data['nombre']);
        $ticketType->setPrecio((float) $data['precio']);
        $ticketType->setActivo($data['activo'] ?? true);

        $em->persist($ticketType);
        $em->flush();

        return $this->json(['message' => 'Tipo de ticket creado', 'id' => $ticketType->getId()], 201);
    }

    #[Route('/{id}', name: 'update_ticket_type', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $ticketType = $em->getRepository(TicketType::class)->find($id);
        if (!$ticketType) {
            return $this->json(['error' => 'Tipo de ticket no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Datos incompletos'], 400);
        }

        if (isset($data['nombre'])) {
            $ticketType->setNombre($data['nombre']);
        }
        if (isset($data['precio'])) {
            $ticketType->setPrecio((float) $data['precio']);
        }
        if (isset($data['activo'])) {
            $ticketType->setActivo((bool) $data['activo']);
        }

        $em->flush();

        return $this->json(['message' => 'Tipo de ticket actualizado']);
    }

    #[Route('/{id}', name: 'delete_ticket_type', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $ticketType = $em->getRepository(TicketType::class)->find($id);
        if (!$ticketType) {
            return $this->json(['error' => 'Tipo de ticket no encontrado'], 404);
        }

        $em->remove($ticketType);
        $em->flush();

        return $this->json(['message' => 'Tipo de ticket eliminado']);
    }
}
