<?php

namespace App\Controller;

use App\Entity\Activity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/actividades')]
class ActivityController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $actividades = $em->getRepository(Activity::class)->findAll();
        $hoy = new \DateTime();

        $data = array_map(function (Activity $a) use ($hoy) {
            return [
                'id'           => $a->getId(),
                'nombre'       => $a->getNombre(),
                'descripcion'  => $a->getDescripcion(),
                'fechaInicio'  => $a->getFechaInicio()->format('Y-m-d'),
                'fechaFin'     => $a->getFechaFin()->format('Y-m-d'),
                'activa'       => $a->isActiva(),
                'vigente'      => $a->isActiva() &&
                                  $a->getFechaInicio() <= $hoy &&
                                  $a->getFechaFin() >= $hoy,
            ];
        }, $actividades);

        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $actividad = new Activity();
        $actividad->setNombre($data['nombre']);
        $actividad->setDescripcion($data['descripcion']);
        $actividad->setFechaInicio(new \DateTime($data['fechaInicio']));
        $actividad->setFechaFin(new \DateTime($data['fechaFin']));
        $actividad->setActiva($data['activa'] ?? true);

        $em->persist($actividad);
        $em->flush();

        return $this->json(['message' => 'Actividad creada con éxito'], 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $actividad = $em->getRepository(Activity::class)->find($id);
        if (!$actividad) {
            return $this->json(['message' => 'Actividad no encontrada'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $actividad->setNombre($data['nombre']);
        $actividad->setDescripcion($data['descripcion']);
        $actividad->setFechaInicio(new \DateTime($data['fechaInicio']));
        $actividad->setFechaFin(new \DateTime($data['fechaFin']));
        $actividad->setActiva($data['activa']);

        $em->flush();

        return $this->json(['message' => 'Actividad actualizada con éxito']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $actividad = $em->getRepository(Activity::class)->find($id);
        if (!$actividad) {
            return $this->json(['message' => 'Actividad no encontrada'], 404);
        }

        $em->remove($actividad);
        $em->flush();

        return $this->json(['message' => 'Actividad eliminada con éxito']);
    }

      #[Route('/activa', name: 'actividad_activa', methods: ['GET'])]
    public function actividadActiva(EntityManagerInterface $em): JsonResponse
    {
        $ahora = new \DateTime();
        $actividad = $em->getRepository(Activity::class)->createQueryBuilder('a')
            ->where('a.activa = true')
            ->andWhere('a.fechaInicio <= :ahora')
            ->andWhere('a.fechaFin >= :ahora')
            ->setParameter('ahora', $ahora)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$actividad) {
            return $this->json(['error' => 'No hay actividad activa'], 404);
        }

        return $this->json([
            'id' => $actividad->getId(),
            'nombre' => $actividad->getNombre(),
            'descripcion' => $actividad->getDescripcion(),
            'fechaInicio' => $actividad->getFechaInicio()->format('Y-m-d'),
            'fechaFin' => $actividad->getFechaFin()->format('Y-m-d'),
        ]);
    }
}

