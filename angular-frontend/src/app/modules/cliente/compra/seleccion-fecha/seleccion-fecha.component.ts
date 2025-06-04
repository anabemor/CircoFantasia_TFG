import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';
import { MY_DATE_FORMATS } from '../../../../shared/utils/date-formats';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-seleccion-fecha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './seleccion-fecha.component.html'
})
export class SeleccionFechaComponent implements OnInit {
  fechaSeleccionada: Date | null = null;
  aforoDisponible: number | null = null;
  fechasBloqueadas = new Set<string>();
  fechasCargadas = false;

  fechaMinima: Date = new Date();
  fechaMaxima: Date = new Date();

  constructor(
    private reservaService: ReservaService,
    private compraService: CompraService,
    private router: Router,
    private toast: ToastService  
  ) {}

  ngOnInit(): void {
    const actividad = this.compraService.getActividad();
    if (!actividad) {
      //alert('No hay actividad activa disponible. Inténtalo más tarde.');
      this.router.navigate(['/']);
      return;
    }

    this.fechaMinima = new Date(actividad.fechaInicio);
    this.fechaMaxima = new Date(actividad.fechaFin);

    this.cargarFechasBloqueadas();

    const fechaGuardada = this.compraService.getFecha();
    if (fechaGuardada) {
      this.fechaSeleccionada = fechaGuardada;
      this.onFechaCambiada(fechaGuardada);
    }
  }

  cargarFechasBloqueadas(): void {
    const dias = 60; // puede ajustar según el rango real
    const peticiones = [];

    for (let i = 0; i < dias; i++) {
      const fecha = new Date(this.fechaMinima);
      fecha.setDate(this.fechaMinima.getDate() + i);
      if (fecha > this.fechaMaxima) break;

      const fechaISO = formatDate(fecha, 'yyyy-MM-dd', 'es');
      peticiones.push(this.reservaService.getAforoPorFecha(fechaISO));
    }

    forkJoin(peticiones).subscribe({
      next: (resultados) => {
        resultados.forEach((res) => {
          if (res.disponible === 0) {
            this.fechasBloqueadas.add(res.fecha);
          }
        });
        this.fechasCargadas = true;
      },
      error: () => {
        console.warn('Error al cargar fechas bloqueadas.');
      }
    });
  }

  filtroFecha = (d: Date | null): boolean => {
    if (!d) return false;
    const iso = formatDate(d, 'yyyy-MM-dd', 'es');

    if (d < this.fechaMinima || d > this.fechaMaxima) return false;
    return !this.fechasBloqueadas.has(iso);
  };

  marcarFechasCompletas = (d: Date): string => {
    const iso = formatDate(d, 'yyyy-MM-dd', 'es');
    return this.fechasBloqueadas.has(iso) ? 'fecha-completa' : '';
  };

  onFechaCambiada(fecha: Date | null): void {
    if (!fecha) {
      this.aforoDisponible = null;
      return;
    }

    const iso = formatDate(fecha, 'yyyy-MM-dd', 'es');
    this.reservaService.getAforoPorFecha(iso).subscribe({
      next: (res) => {
        this.aforoDisponible = res.disponible;
        this.compraService.setFecha(fecha);
      },
      error: () => {
        this.aforoDisponible = null;
        console.warn('Error al consultar aforo para', iso);
      }
    });
  }

  continuar(): void {
    if (!this.fechaSeleccionada) {
      this.toast.warning('Por favor, selecciona una fecha válida.');
      return;
    }

    const fecha = this.fechaSeleccionada;
    const iso = formatDate(fecha, 'yyyy-MM-dd', 'es');

    if (fecha < this.fechaMinima || fecha > this.fechaMaxima) {
      this.toast.warning('La fecha seleccionada está fuera del rango de la actividad.');
      return;
    }

    if (this.fechasBloqueadas.has(iso)) {
      this.toast.warning('La fecha seleccionada está completa. Elige otra.');
      return;
    }

    this.router.navigate(['/compra/datos']);
  }

  volver(): void {
    this.router.navigate(['/compra/tickets']);
  }
}
