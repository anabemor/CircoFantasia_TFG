import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../../shared/services/reserva.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-aforo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aforo.component.html'

})
export class AdminAforoComponent implements OnInit {
  aforoDatos: { fecha: string; ocupado: number; disponible: number }[] = [];

  private reservaService = inject(ReservaService);

  ngOnInit(): void {
    const fechas = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const observables: Observable<{ fecha: string; ocupado: number; disponible: number }>[] =
      fechas.map(f => this.reservaService.getAforoPorFecha(f));

    forkJoin(observables).subscribe((result) => {
      this.aforoDatos = result;
    });
  }
}
