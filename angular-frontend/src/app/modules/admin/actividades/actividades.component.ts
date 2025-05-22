import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActividadService, Actividad } from '../../../shared/services/actividad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actividades',
  standalone: true,
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
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

  constructor(private actividadService: ActividadService, private snackBar: MatSnackBar) {}

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
    if (confirm('¿Seguro que deseas eliminar esta actividad?')) {
      this.actividadService.eliminarActividad(id).subscribe(() => {
        this.snackBar.open('Actividad eliminada', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.cargarActividades();
      });
    }
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
  }
}
