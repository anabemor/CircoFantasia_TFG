//Componente padre: hace la llamada al backend

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../shared/services/reserva-admin.service';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { ReservaCreateFormComponent } from './reserva-create-form/reserva-create-form.component';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { AdminAforoComponent } from './aforo/aforo.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    ReservaFormComponent,
    ReservaCreateFormComponent,
    NavbarAdminComponent,
    AdminAforoComponent
],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];

  // NUEVO: mensaje de aforo para el hijo
  aforoError: string | null = null;

  // Controladores
  mostrarFormularioEdicion = false;
  mostrarFormularioCreacion = false;
  reservaEnEdicion: Reserva | null = null;
  mostrarAforo = false;

  constructor(
    private reservaService: ReservaAdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => this.reservas = data,
      error: () => alert('Error al cargar las reservas')
    });
  }

  abrirFormularioCrear(): void {
    this.mostrarFormularioCreacion = true;
    this.mostrarFormularioEdicion = false;
    this.reservaEnEdicion = null;
    this.aforoError = null; // Limpiar errores al abrir
  }

  crearReserva(reserva: Reserva): void {
    this.reservaService.createReserva(reserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.mostrarFormularioCreacion = false;
        this.aforoError = null;
        this.snackBar.open('Reserva creada correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Error al crear reserva:', err); // 🐞 debería verse aquí
        const mensaje = err?.error?.error || 'Error al crear la reserva';
        this.aforoError = mensaje;
      }
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Eliminar reserva',
        mensaje: '¿Estás seguro de eliminar esta reserva?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.reservaService.deleteReserva(id).subscribe({
          next: () => {
            this.snackBar.open('Reserva eliminada correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.cargarReservas();
          },
          error: () => {
            this.snackBar.open('Error al eliminar la reserva', 'Cerrar', {
              duration: 3000,
              panelClass: ['bg-red-500', 'text-white']
            });
          }
        });
      }
    });
  }

  cancelarReserva(reserva: Reserva): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Cancelar reserva',
        mensaje: '¿Seguro que deseas cancelar esta reserva?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const reservaActualizada: Reserva = { ...reserva, estado: 'cancelado' };

        this.reservaService.updateReserva(reserva.id!, reservaActualizada).subscribe({
          next: () => {
            this.snackBar.open(`Reserva cancelada. Reembolso simulado: ${this.calcularPrecioTotal(reserva)} €`, 'Cerrar', {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.cargarReservas();
          },
          error: () => {
            this.snackBar.open('Error al cancelar la reserva', 'Cerrar', {
              duration: 3000,
              panelClass: ['bg-red-500', 'text-white']
            });
          }
        });
      }
    });
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

  toggleAforo(): void {
    this.mostrarAforo = !this.mostrarAforo;
  } 
}
