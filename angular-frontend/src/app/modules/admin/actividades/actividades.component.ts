import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActividadService } from '../../../shared/services/actividad.service';
import { Actividad } from '../../../shared/interfaces/actividad.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-actividades',
  standalone: true,
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarAdminComponent ]
})
export class ActividadesComponent implements OnInit {
  actividades: Actividad[] = [];
  actividadEnEdicion: Actividad | null = null;
  mostrarFormulario = false;
  modoEdicion = false;
  fechasInvalidas: boolean = false;
  
  // Modelo del formulario
  formActividad: Actividad = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    activa: true
  };

  constructor(private actividadService: ActividadService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades() {
    this.actividadService.getActividades().subscribe(data => {
      this.actividades = data;
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
      this.actividadService.actualizarActividad(this.actividadEnEdicion.id, this.formActividad)
        .subscribe(() => {
          this.snackBar.open('Actividad actualizada con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.mostrarFormulario = false;
          this.cargarActividades();
        });
    } else {
      this.actividadService.crearActividad(this.formActividad)
        .subscribe(() => {
          this.snackBar.open('Actividad creada con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.mostrarFormulario = false;
          this.cargarActividades();
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
        this.actividadService.eliminarActividad(id).subscribe(() => {
          this.snackBar.open('Actividad eliminada', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.cargarActividades();
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
    this.fechasInvalidas = false; //resetea el error de fechas
  }

  validarFechas(): void {
    this.fechasInvalidas = new Date(this.formActividad.fechaFin) < new Date(this.formActividad.fechaInicio);
  }
}
