export interface ReservaEnvio {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // formato YYYY-MM-DD
  email: string;
  telefono: string;
  fechaVisita: string;
  fechaReserva: string;
  aceptoCondiciones: boolean;
  estado: string;
  tickets: {
    ticketType: {
      id: number;
    };
    cantidad: number;
  }[];
}
