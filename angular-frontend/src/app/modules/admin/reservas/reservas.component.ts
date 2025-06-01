import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../shared/services/reserva-admin.service';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { ReservaCreateFormComponent } from './reserva-create-form/reserva-create-form.component';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { AdminAforoComponent } from './aforo/aforo.component';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
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
  reservasFiltradas: Reserva[] = [];

  filtroTexto: string = '';
  filtroFecha: string = '';

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
      next: (data) => {
        this.reservas = data;
        this.aplicarFiltros(); // Aplica filtros automáticamente
      },
      error: () => alert('Error al cargar las reservas')
    });
  }

  filtroEstado: string = '';

  aplicarFiltros(): void {
    const texto = this.filtroTexto.toLowerCase();
    const fecha = this.filtroFecha;
    const estado = this.filtroEstado;

    this.reservasFiltradas = this.reservas.filter((reserva) => {
      const coincideTexto =
        reserva.nombre.toLowerCase().includes(texto) ||
        reserva.apellidos.toLowerCase().includes(texto) ||
        reserva.email.toLowerCase().includes(texto);

      const coincideFecha = fecha
        ? reserva.fechaVisita.startsWith(fecha)
        : true;

      const coincideEstado = estado
        ? reserva.estado === estado
        : true;

      return coincideTexto && coincideFecha && coincideEstado;
    });

    this.currentPage = 1;
  }

  abrirFormularioCrear(): void {
    this.mostrarFormularioCreacion = true;
    this.mostrarFormularioEdicion = false;
    this.reservaEnEdicion = null;
    this.aforoError = null;
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
        console.error('Error al crear reserva:', err);
        const mensaje = err?.error?.error || 'Error al crear la reserva';
        this.aforoError = mensaje;
      }
    });
  }

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

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;

  get totalPages(): number {
    return Math.ceil(this.reservasFiltradas.length / this.itemsPerPage);
  }

  get reservasFiltradasPaginaActual(): Reserva[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    return this.reservasFiltradas.slice(inicio, inicio + this.itemsPerPage);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }

  // Ordenar tabla
  ordenActual: keyof Reserva | '' = '';
  ordenAscendente = true;

  ordenarPor(campo: keyof Reserva): void {
    if (this.ordenActual === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenActual = campo;
      this.ordenAscendente = true;
    }

    this.reservasFiltradas.sort((a, b) => {
      const valorA = a[campo] ?? '';
      const valorB = b[campo] ?? '';

      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return this.ordenAscendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      }

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return this.ordenAscendente ? valorA - valorB : valorB - valorA;
      }

      return 0;
    });
  }
  

  limpiarFiltros(): void {
  this.filtroTexto = '';
  this.filtroFecha = '';
  this.filtroEstado= '';
  this.aplicarFiltros();
  }

  mostrarBuscador: boolean = false;

  toggleBuscador(): void {
    this.mostrarBuscador = !this.mostrarBuscador;
  }


}
