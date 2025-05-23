import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';

@Component({
  selector: 'app-seleccion-fecha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './seleccion-fecha.component.html'
})
export class SeleccionFechaComponent {
  fechaSeleccionada: Date | null = null;
  aforoDisponible: number | null = null;

  constructor(
    private compraService: CompraService,
    private router: Router
  ) {}

  onFechaCambiada(fecha: Date | null) {
    this.fechaSeleccionada = fecha;
    if (fecha) {
      this.aforoDisponible = null; // Mientras no tengamos el backend

      // Más adelante: consultar el aforo real
      // this.aforoService.getAforo(fecha).subscribe((aforo) => {
      //   this.aforoDisponible = aforo;
      // });

      this.compraService.setFecha(fecha); // Guardamos la fecha en el servicio
    }
  }

  continuar() {
    if (!this.fechaSeleccionada) {
      alert('Por favor selecciona una fecha.');
      return;
    }

    this.router.navigate(['/compra/datos']);
  }
}
