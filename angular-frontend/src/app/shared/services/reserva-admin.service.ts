import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../interfaces/reserva.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservaAdminService {
  private baseUrl = 'http://localhost:8000/api/admin/reservas'; // asegúrate de que esta sea tu ruta de administración

  constructor(private http: HttpClient) {}

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  getReserva(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${id}`);
  }

  createReserva(reserva: Reserva): Observable<Reserva> {
  return this.http.post<Reserva>('http://localhost:8000/api/admin/reservas/crear', reserva);
}

  updateReserva(id: number, reserva: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
