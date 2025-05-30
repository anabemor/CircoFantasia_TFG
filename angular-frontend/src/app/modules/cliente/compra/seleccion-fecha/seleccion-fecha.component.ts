import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';
import { MY_DATE_FORMATS } from '../../../../shared/utils/date-formats';

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
    fechaMinima: Date = new Date(); //fecha mínima hoy

  constructor(
    private reservaService: ReservaService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarAforoProximosDias();

    const fechaGuardada = this.compraService.getFecha();
    if (fechaGuardada) {
      this.fechaSeleccionada = fechaGuardada;
      this.onFechaCambiada(fechaGuardada); // 🔁 actualiza aforo si ya hay fecha seleccionada
    }
  }

  consultarAforoProximosDias(): void {
    const hoy = new Date();
    const dias = 30;

    for (let i = 0; i < dias; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const fechaISO = fecha.toISOString().split('T')[0];

      this.reservaService.getAforoPorFecha(fechaISO).subscribe({
        next: (res) => {
          if (res.disponible === 0) {
            this.fechasBloqueadas.add(res.fecha); // bloquear si está lleno
          }
        },
        error: () => {
          console.warn('Error al consultar aforo para', fechaISO);
        }
      });
    }
  }

  filtroFecha = (d: Date | null): boolean => {
    if (!d) return false;
    const iso = d.toISOString().split('T')[0];
    return !this.fechasBloqueadas.has(iso);
  };

  onFechaCambiada(fecha: Date | null): void {
    if (!fecha) {
      this.aforoDisponible = null;
      return;
    }

    const iso = fecha.toISOString().split('T')[0];
    this.reservaService.getAforoPorFecha(iso).subscribe({
      next: (res) => {
        this.aforoDisponible = res.disponible;
        this.compraService.setFecha(fecha); // guardamos la fecha elegida
      },
      error: () => {
        this.aforoDisponible = null;
        console.warn('No se pudo obtener el aforo de', iso);
      }
    });
  }

  continuar(): void {
    if (!this.fechaSeleccionada) {
      alert('Por favor, selecciona una fecha válida.');
      return;
    }

    this.router.navigate(['/compra/datos']);
  }
}
