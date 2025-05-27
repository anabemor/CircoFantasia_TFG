import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservaEnvio } from '../interfaces/reserva-envio.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private baseUrl = 'http://localhost:8000/api'; // Cambia si usas un dominio distinto

  constructor(private http: HttpClient) {}

  enviarReserva(reserva: ReservaEnvio): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservas`, reserva);

  }

  getAforoPorFecha(fecha: string): Observable<{ fecha: string; ocupado: number; disponible: number }> {
  return this.http.get<{ fecha: string; ocupado: number; disponible: number }>(
    `${this.baseUrl}/reservas/aforo/${fecha}`
  );
}
}
