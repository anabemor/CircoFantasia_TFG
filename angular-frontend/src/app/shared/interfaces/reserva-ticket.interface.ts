export interface ReservaTicket {
  id?: number;
  ticketType: {
    id: number;
    nombre: string;
    precio: number;
  };
  cantidad: number;
}
