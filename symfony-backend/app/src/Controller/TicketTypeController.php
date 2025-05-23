<?php

namespace App\Controller;

use App\Entity\TicketType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}
