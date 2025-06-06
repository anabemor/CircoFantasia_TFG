import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActividadService } from '../../../shared/services/actividad.service';
import { TicketTypeService } from '../../../shared/services/ticket-type.service';
import { Actividad } from '../../../shared/interfaces/actividad.interface';
import { TicketType } from '../../../shared/interfaces/ticket-type.interface';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { ToastService } from '../../../shared/services/toast.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-actividades',
  standalone: true,
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarAdminComponent]
})
export class ActividadesComponent implements OnInit {
  actividades: Actividad[] = [];
  ticketTypes: TicketType[] = [];
  actividadEnEdicion: Actividad | null = null;
  mostrarFormulario = false;
  modoEdicion = false;
  fechasInvalidas: boolean = false;
  
  formActividad: Actividad = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    activa: true
  };

  constructor(
    private actividadService: ActividadService,
    private ticketTypeService: TicketTypeService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
    this.cargarTiposTicket();
  }

  cargarActividades() {
    this.actividadService.getActividades().subscribe({
      next: (data) => this.actividades = data,
      error: (err) => {
        console.error('Error al cargar actividades:', err);
        this.toast.error('Error al cargar actividades');
      }
    });
  }

  cargarTiposTicket() {
    this.ticketTypeService.getTiposTicket().subscribe({
      next: data => this.ticketTypes = data,
      error: () => this.toast.error('Error al cargar tipos de ticket')
    });
  }

  crearNueva() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.fechasInvalidas = false;
    this.formActividad = {
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      activa: true
    };
  }

  editarActividad(actividad: Actividad) {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.fechasInvalidas = false;
    this.formActividad = { ...actividad };
    this.actividadEnEdicion = actividad;
  }

  guardarActividad() {
    this.fechasInvalidas = new Date(this.formActividad.fechaFin) < new Date(this.formActividad.fechaInicio);
    if (this.fechasInvalidas) return;

    if (this.modoEdicion && this.actividadEnEdicion?.id) {
      this.actividadService.actualizarActividad(this.actividadEnEdicion.id, this.formActividad).subscribe({
        next: () => {
          this.toast.success('Actividad actualizada con éxito');
          this.mostrarFormulario = false;
          this.cargarActividades();
        },
        error: () => {
          this.toast.error('Error al actualizar la actividad');
        }
      });
    } else {
      this.actividadService.crearActividad(this.formActividad).subscribe({
        next: () => {
          this.toast.success('Actividad creada con éxito');
          this.mostrarFormulario = false;
          this.cargarActividades();
        },
        error: () => {
          this.toast.error('Error al crear la actividad');
        }
      });
    }
  }

  eliminarActividad(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        mensaje: '¿Seguro que deseas eliminar esta actividad?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.actividadService.eliminarActividad(id).subscribe({
          next: () => {
            this.toast.success('Actividad eliminada');
            this.cargarActividades();
          },
          error: () => {
            this.toast.error('Error al eliminar la actividad');
          }
        });
      }
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.formActividad = {
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      activa: true
    };
    this.fechasInvalidas = false;
  }

  validarFechas(): void {
    this.fechasInvalidas = new Date(this.formActividad.fechaFin) < new Date(this.formActividad.fechaInicio);
  }

  actualizarPrecio(tipo: TicketType) {
    this.ticketTypeService.updateTicketType(tipo.id, { precio: tipo.precio }).subscribe({
      next: () => this.toast.success('Precio actualizado'),
      error: () => this.toast.error('Error al actualizar precio')
    });
  }

}
