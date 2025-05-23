import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TicketSeleccionado {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class CompraService {
  private ticketsSubject = new BehaviorSubject<TicketSeleccionado[]>([]);
  tickets$ = this.ticketsSubject.asObservable();

 setTickets(tickets: TicketSeleccionado[]) {
    this.ticketsSubject.next(tickets);
  }

  getTickets(): TicketSeleccionado[] {
    return this.ticketsSubject.getValue();
  }

  private fechaSeleccionada: Date | null = null;

setFecha(fecha: Date): void {
  this.fechaSeleccionada = fecha;
}

getFecha(): Date | null {
  return this.fechaSeleccionada;
}
}
