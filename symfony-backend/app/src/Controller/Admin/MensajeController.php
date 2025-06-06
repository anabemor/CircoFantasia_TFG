<?php

namespace App\Controller\Admin;

use App\Entity\Mensaje;
use App\Repository\MensajeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/mensajes')]
class MensajeController extends AbstractController
{
    #[Route('', name: 'crear_mensaje', methods: ['POST'])]
    public function crear(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (
            empty($data['nombre']) || strlen($data['nombre']) < 3 ||
            empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL) ||
            empty($data['contenido']) || empty($data['asunto'])
        ) {
            return $this->json(['error' => 'Datos inválidos o incompletos.'], 400);
        }

        $mensaje = new Mensaje();
        $mensaje->setNombre($data['nombre']);
        $mensaje->setEmail($data['email']);
        $mensaje->setTelefono($data['telefono'] ?? null);
        $mensaje->setAsunto($data['asunto']);
        $mensaje->setContenido($data['contenido']);
        $mensaje->setFecha(new \DateTime());
        $mensaje->setRespondido(false);

        $em->persist($mensaje);
        $em->flush();

        return $this->json(['success' => true], 201);
    }

    #[Route('', name: 'listar_mensajes', methods: ['GET'])]
    public function listar(MensajeRepository $repo): JsonResponse
    {
        $mensajes = $repo->findBy([], ['fecha' => 'DESC']);
        $datos = [];

        foreach ($mensajes as $m) {
            $datos[] = [
                'id' => $m->getId(),
                'nombre' => $m->getNombre(),
                'email' => $m->getEmail(),
                'telefono' => $m->getTelefono(),
                'asunto' => $m->getAsunto(),
                'contenido' => $m->getContenido(),
                'fecha' => $m->getFecha()->format('Y-m-d H:i:s'),
                'respondido' => $m->isRespondido()
            ];
        }

        return $this->json($datos);
    }

    #[Route('/{id}/responder', name: 'responder_mensaje', methods: ['PATCH'])]
    public function responder(int $id, MensajeRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $mensaje = $repo->find($id);
        if (!$mensaje) {
            return $this->json(['error' => 'Mensaje no encontrado.'], 404);
        }

        $mensaje->setRespondido(true);
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/{id}', name: 'eliminar_mensaje', methods: ['DELETE'])]
    public function eliminar(int $id, MensajeRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $mensaje = $repo->find($id);

        if (!$mensaje) {
            return $this->json(['error' => 'Mensaje no encontrado.'], 404);
        }

        $em->remove($mensaje);
        $em->flush();

        return $this->json(['success' => true]);
    }
     #[Route('/enviar-masivo', name: 'enviar_mensaje_masivo', methods: ['POST'])]
    public function enviarMasivo(Request $request, MensajeRepository $repo, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['ids']) || !is_array($data['ids']) || empty($data['plantilla'])) {
            return $this->json(['error' => 'Datos inválidos o incompletos.'], 400);
        }
         $mensajes = $repo->findBy(['id' => $data['ids']]);

        $plantilla = $data['plantilla'];
        switch ($plantilla) {
            case 'promocion':
                $asunto = 'Promoción Especial';
                $contenido = '¡Disfruta de nuestras ofertas en Circo Fantasía!';
                break;
            case 'agradecimiento':
                $asunto = 'Gracias por contactar con nosotros';
                $contenido = 'Gracias por tu interés en Circo Fantasía. Pronto te contactaremos.';
                break;
            default:
                $asunto = 'Aviso Circo Fantasía';
                $contenido = $plantilla;
                break;
        }

        $enviados = 0;
        foreach ($mensajes as $m) {
            $email = (new Email())
                ->from('no-reply@circofantasia.local')
                ->to($m->getEmail())
                ->subject($asunto)
                ->text($contenido);

            try {
                $mailer->send($email);
                $enviados++;
            } catch (\Exception $e) {
                // Ignorar errores
            }
        }

        return $this->json(['success' => true, 'enviados' => $enviados]);
    }
}
