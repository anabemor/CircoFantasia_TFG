import { ReservaTicket } from './reserva-ticket.interface';

export interface Reserva {
  id?: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // formato ISO 'YYYY-MM-DD'
  email: string;
  telefono: string;
  fechaVisita: string; // formato ISO 'YYYY-MM-DD'
  fechaReserva: string; // formato ISO, se puede autocompletar en backend
  aceptoCondiciones: boolean;
  tickets: ReservaTicket[]; // relación con los tickets
  estado: 'pendiente' | 'pagado' | 'cancelado';
}
