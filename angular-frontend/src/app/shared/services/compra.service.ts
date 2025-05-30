import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reserva } from '../interfaces/reserva.interface';
import { ReservaEnvio } from '../interfaces/reserva-envio.interface';
import { Actividad } from '../interfaces/actividad.interface';
import { formatDate } from '@angular/common';

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

  setFecha(fecha: Date | null): void {
  this.fechaSeleccionada = fecha;
}

  getFecha(): Date | null {
    return this.fechaSeleccionada;
    }

//para que genere el objeto Reserva (con los todos los datos del cliente)
private datosCliente: {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  aceptoCondiciones: boolean;
} | null = null;

setDatosCliente(datos: {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  aceptoCondiciones: boolean;
}): void {
  this.datosCliente = datos;
}

getDatosCliente() {
  return this.datosCliente;
}

crearReserva(): ReservaEnvio | null {
  if (!this.fechaSeleccionada || !this.datosCliente) return null;

  return {
    nombre: this.datosCliente.nombre,
    apellidos: this.datosCliente.apellidos,
    fechaNacimiento: this.datosCliente.fechaNacimiento,
    email: this.datosCliente.email,
    telefono: this.datosCliente.telefono,
    fechaVisita: formatDate(this.fechaSeleccionada, 'yyyy-MM-dd', 'en'),
    fechaReserva: new Date().toISOString().split('T')[0],
    aceptoCondiciones: this.datosCliente.aceptoCondiciones,
    estado: 'pagado',
    tickets: this.getTickets().map(ticket => ({
      ticketType: { id: ticket.id }, //  solo enviamos el id
      cantidad: ticket.cantidad
    }))
  };
}
private actividadSeleccionada: Actividad | null = null;

setActividad(actividad: Actividad | null): void {
  this.actividadSeleccionada = actividad;
}

getActividad(): Actividad | null {
  return this.actividadSeleccionada;
}

limpiar(): void {
  this.setTickets([]);
  this.setFecha(null);
  this.setActividad(null);
}

}

