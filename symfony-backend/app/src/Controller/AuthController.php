<?php

namespace App\Controller;

// Importa la clase base que permite crear controladores en Symfony
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

// Permite devolver respuestas HTTP
use Symfony\Component\HttpFoundation\Response;

// Anotación para definir rutas
use Symfony\Component\Routing\Attribute\Route;

// Entidad User (modelo de usuario que se usará para registrar)
use App\Entity\User;

// Permite interactuar con la base de datos
use Doctrine\ORM\EntityManagerInterface;

// Permite devolver respuestas en formato JSON
use Symfony\Component\HttpFoundation\JsonResponse;

// Permite acceder al cuerpo de la petición (Request POST)
use Symfony\Component\HttpFoundation\Request;

// Para hashear (encriptar) contraseñas de forma segura
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

// Definimos la clase como `final` (no se puede heredar) y como controlador de Symfony
final class AuthController extends AbstractController
{
    // Define una ruta que responde a POST /api/register
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        // Decodifica el JSON recibido en el cuerpo de la petición
        $data = json_decode($request->getContent(), true);

        // Crea un nuevo objeto User (entidad)
        $user = new User();

        // Establece el email del nuevo usuario
        $user->setEmail($data['email']);

        // Encripta la contraseña recibida usando el servicio de hashing
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Asigna el rol ROLE_USER por defecto
        $user->setRoles(['ROLE_USER']);

        // Marca el nuevo usuario para guardarlo en la base de datos
        $em->persist($user);

        // Ejecuta la inserción en la base de datos
        $em->flush();

        // Devuelve una respuesta JSON con mensaje de éxito y código 201 (creado)
        return $this->json(['message' => 'Usuario registrado correctamente'], 201);
    }
}
