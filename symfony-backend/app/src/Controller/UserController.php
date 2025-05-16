<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;


final class UserController extends AbstractController
{
   #[Route('/api/me', name: 'api_me', methods: ['GET'])]
   #[IsGranted('IS_AUTHENTICATED_FULLY')]
   public function me(): JsonResponse
   {
       $user = $this->getUser();


       return $this->json([
           'id' => $user->getId(),
           'email' => $user->getUserIdentifier(),
           'roles' => $user->getRoles(),
       ]);
   }
}
