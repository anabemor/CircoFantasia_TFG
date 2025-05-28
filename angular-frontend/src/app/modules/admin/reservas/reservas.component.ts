import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../shared/services/reserva-admin.service';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReservaFormComponent, NavbarAdminComponent],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  mostrarFormulario = false;
  reservaEnEdicion: Reserva | null = null;

  constructor(private reservaService: ReservaAdminService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
  this.reservaService.getReservas().subscribe({
      next: (data) => {
        console.log('Reservas recibidas:', data);
        this.reservas = data;
      },
      error: () => alert('Error al cargar las reservas')
    });
  }
  

  crearReserva() {
    this.mostrarFormulario = true;
    this.reservaEnEdicion = null;
  }

  editarReserva(reserva: Reserva) {
    this.mostrarFormulario = true;
    this.reservaEnEdicion = reserva;
  }

  eliminarReserva(id: number) {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      this.reservaService.deleteReserva(id).subscribe(() => this.cargarReservas());
    }
  }

  guardarReserva(reserva: Reserva) {
    if (this.reservaEnEdicion?.id) {
      this.reservaService.updateReserva(this.reservaEnEdicion.id, reserva).subscribe(() => {
        this.mostrarFormulario = false;
        this.cargarReservas();
      });
    } else {
      this.reservaService.createReserva(reserva).subscribe(() => {
        this.mostrarFormulario = false;
        this.cargarReservas();
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.reservaEnEdicion = null;
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

  getEstadoVisual(estado: string): string {
  switch (estado) {
    case 'pagado':
      return '🟢 Pagado';
    case 'pendiente':
      return '🟡 Pendiente';
    case 'cancelado':
      return '🔴 Cancelado';
    default:
      return estado;
  }
}

}

