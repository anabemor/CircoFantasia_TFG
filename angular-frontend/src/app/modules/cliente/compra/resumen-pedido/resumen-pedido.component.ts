import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService, TicketSeleccionado } from '../../../../shared/services/compra.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resumen-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-pedido.component.html'
})
export class ResumenPedidoComponent {
  tickets$: Observable<TicketSeleccionado[]>;

   constructor(public compraService: CompraService) {
    this.tickets$ = this.compraService.tickets$;
  }

  calcularTotal(tickets: TicketSeleccionado[]): number {
    return tickets.reduce((suma, t) => suma + t.precio * t.cantidad, 0);
  }
}
