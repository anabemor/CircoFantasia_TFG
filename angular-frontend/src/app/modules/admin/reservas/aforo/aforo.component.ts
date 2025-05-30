import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../../shared/services/reserva.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-aforo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aforo.component.html'
})
export class AdminAforoComponent implements OnInit {
  aforoDatos: { fecha: string; ocupado: number; disponible: number }[] = [];

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;

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

  get totalPages(): number {
    return Math.ceil(this.aforoDatos.length / this.itemsPerPage);
  }

  get fechasPaginaActual() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.aforoDatos.slice(start, start + this.itemsPerPage);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }
}
