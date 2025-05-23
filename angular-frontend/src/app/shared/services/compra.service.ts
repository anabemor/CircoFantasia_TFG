import { Injectable } from '@angular/core';

export interface TicketSeleccionado {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class CompraService {
  ticketsSeleccionados: TicketSeleccionado[] = [];

  setTickets(tickets: TicketSeleccionado[]) {
    this.ticketsSeleccionados = tickets;
  }

  getTickets(): TicketSeleccionado[] {
    return this.ticketsSeleccionados;
  }
}
