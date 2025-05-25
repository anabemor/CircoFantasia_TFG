import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketTypeService} from '../../../../shared/services/ticket-type.service';
import { CompraService, TicketSeleccionado } from '../../../../shared/services/compra.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';

@Component({
  selector: 'app-seleccion-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccion-tickets.component.html'
})
export class SeleccionTicketsComponent implements OnInit {
  tiposTicket: TicketType[] = [];
  cantidades: { [id: number]: number } = {};

  constructor(
    private ticketTypeService: TicketTypeService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticketTypeService.getTiposTicket().subscribe((tipos) => {
      this.tiposTicket = tipos;
     // this.tiposTicket = tipos.filter(t => t.activo); // anulo temporal: por si más adelante filtras por estado
      // Inicializar las cantidades en 0
      for (let tipo of this.tiposTicket) {
        this.cantidades[tipo.id] = 0;
      }
    });
  }

   restarCantidad(id: number): void {
    this.cantidades[id] = Math.max(0, this.cantidades[id] - 1);
    this.actualizarCompra(); // 👈
  }

  sumarCantidad(id: number): void {
    this.cantidades[id] += 1;
    this.actualizarCompra(); // 👈
  }

  actualizarCompra(): void {
    const seleccionados: TicketSeleccionado[] = this.tiposTicket
      .filter(t => this.cantidades[t.id] > 0)
      .map(t => ({
        id: t.id,
        nombre: t.nombre,
        cantidad: this.cantidades[t.id],
        precio: t.precio
      }));

    this.compraService.setTickets(seleccionados);
  }

  continuar(): void {
    // Ya no hace falta volver a llamar a setTickets aquí,
    // si ya se actualiza en tiempo real en los botones.
    if (this.compraService.getTickets().length === 0) {
      alert('Debes seleccionar al menos una entrada.');
      return;
    }

    this.router.navigate(['/compra/fecha']);
  }
}
