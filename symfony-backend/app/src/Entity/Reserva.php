<?php

namespace App\Entity;

use App\Repository\ReservaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\ReservaTicket;

#[ORM\Entity(repositoryClass: ReservaRepository::class)]
class Reserva
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    private ?string $apellidos = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $fechaNacimiento = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $telefono = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $fechaVisita = null;

    #[ORM\Column]
    private ?\DateTime $fechaReserva = null;

    #[ORM\Column]
    private ?bool $aceptoCondiciones = null;

    #[ORM\OneToMany(mappedBy: 'reserva', targetEntity: ReservaTicket::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $reservaTickets;

    public function __construct()
    {
        $this->reservaTickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;
        return $this;
    }

    public function getFechaNacimiento(): ?\DateTime
    {
        return $this->fechaNacimiento;
    }

    public function setFechaNacimiento(\DateTime $fechaNacimiento): static
    {
        $this->fechaNacimiento = $fechaNacimiento;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }

    public function setTelefono(string $telefono): static
    {
        $this->telefono = $telefono;
        return $this;
    }

    public function getFechaVisita(): ?\DateTime
    {
        return $this->fechaVisita;
    }

    public function setFechaVisita(\DateTime $fechaVisita): static
    {
        $this->fechaVisita = $fechaVisita;
        return $this;
    }

    public function getFechaReserva(): ?\DateTime
    {
        return $this->fechaReserva;
    }

    public function setFechaReserva(\DateTime $fechaReserva): static
    {
        $this->fechaReserva = $fechaReserva;
        return $this;
    }

    public function isAceptoCondiciones(): ?bool
    {
        return $this->aceptoCondiciones;
    }

    public function setAceptoCondiciones(bool $aceptoCondiciones): static
    {
        $this->aceptoCondiciones = $aceptoCondiciones;
        return $this;
    }

    /**
     * @return Collection<int, ReservaTicket>
     */
    public function getReservaTickets(): Collection
    {
        return $this->reservaTickets;
    }

    public function addReservaTicket(ReservaTicket $reservaTicket): static
    {
        if (!$this->reservaTickets->contains($reservaTicket)) {
            $this->reservaTickets[] = $reservaTicket;
            $reservaTicket->setReserva($this);
        }

        return $this;
    }

    public function removeReservaTicket(ReservaTicket $reservaTicket): static
    {
        if ($this->reservaTickets->removeElement($reservaTicket)) {
            if ($reservaTicket->getReserva() === $this) {
                $reservaTicket->setReserva(null); // solo si la propiedad en ReservaTicket es nullable
            }
        }

        return $this;
    }
}
