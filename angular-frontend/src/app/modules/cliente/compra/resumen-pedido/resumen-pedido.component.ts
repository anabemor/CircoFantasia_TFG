import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../../shared/services/compra.service';

@Component({
  selector: 'app-resumen-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-pedido.component.html'
})
export class ResumenPedidoComponent {
  constructor(public compraService: CompraService) {}

  get total(): number {
    return this.compraService.getTickets()
      .reduce((suma, ticket) => suma + ticket.precio * ticket.cantidad, 0);
  }
}
