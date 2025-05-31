import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservaEnvio } from '../interfaces/reserva-envio.interface';
import { forkJoin, Observable } from 'rxjs';
import { formatDate } from '@angular/common';

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

getAforoProximos30Dias(): Observable<{ fecha: string; ocupado: number; disponible: number }[]> {
  const fechas = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return formatDate(d, 'yyyy-MM-dd', 'es');
  });

  return forkJoin(fechas.map(f => this.getAforoPorFecha(f)));
}


}
