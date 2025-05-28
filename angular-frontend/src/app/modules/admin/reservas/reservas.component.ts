import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../shared/services/reserva-admin.service';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { ReservaCreateFormComponent } from './reserva-create-form/reserva-create-form.component';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    ReservaFormComponent,
    ReservaCreateFormComponent,
    NavbarAdminComponent
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];

  // Controladores
  mostrarFormularioEdicion = false;
  mostrarFormularioCreacion = false;
  reservaEnEdicion: Reserva | null = null;

  constructor(private reservaService: ReservaAdminService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: () => alert('Error al cargar las reservas')
    });
  }

  // CREACIÓN
  abrirFormularioCrear(): void {
    this.mostrarFormularioCreacion = true;
    this.mostrarFormularioEdicion = false;
    this.reservaEnEdicion = null;
  }

  crearReserva(reserva: Reserva): void {
    this.reservaService.createReserva(reserva).subscribe(() => {
      this.cargarReservas();
      this.mostrarFormularioCreacion = false;
    });
  }

  // EDICIÓN
  editarReserva(reserva: Reserva): void {
    this.reservaEnEdicion = reserva;
    this.mostrarFormularioEdicion = true;
    this.mostrarFormularioCreacion = false;
  }

  guardarReserva(reserva: Reserva): void {
    if (!this.reservaEnEdicion?.id) return;

    this.reservaService.updateReserva(this.reservaEnEdicion.id, reserva).subscribe(() => {
      this.mostrarFormularioEdicion = false;
      this.cargarReservas();
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormularioCreacion = false;
    this.mostrarFormularioEdicion = false;
    this.reservaEnEdicion = null;
  }

  eliminarReserva(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      this.reservaService.deleteReserva(id).subscribe(() => this.cargarReservas());
    }
  }

  cancelarReserva(reserva: Reserva): void {
    if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
      const reservaActualizada: Reserva = {
        ...reserva,
        estado: 'cancelado'
      };

      this.reservaService.updateReserva(reserva.id!, reservaActualizada).subscribe({
        next: () => {
          alert(`Reserva cancelada. Reembolso simulado: ${this.calcularPrecioTotal(reserva)} €`);
          this.cargarReservas();
        },
        error: () => {
          alert('Error al cancelar la reserva.');
        }
      });
    }
  }

  contarEntradas(reserva: Reserva, tipo: string): number {
    return reserva.tickets
      .filter(t => t.ticketType.nombre.toLowerCase() === tipo.toLowerCase())
      .reduce((total, t) => total + t.cantidad, 0);
  }

  calcularPrecioTotal(reserva: Reserva): number {
    return reserva.tickets.reduce((total, t) =>
      total + t.cantidad * t.ticketType.precio, 0);
  }

  getEstadoVisual(estado: string): string {
    switch (estado) {
      case 'pagado': return '🟢 Pagado';
      case 'pendiente': return '🟡 Pendiente';
      case 'cancelado': return '🔴 Cancelado';
      default: return estado;
    }
  }
}
