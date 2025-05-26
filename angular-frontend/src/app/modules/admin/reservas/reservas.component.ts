import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../shared/services/reserva-admin.service';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReservaFormComponent],
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
      next: (data) => this.reservas = data,
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
}
