import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  contenido: string;
  fecha: string;
  respondido: boolean;
}

@Injectable({ providedIn: 'root' })
export class BuzonService {
  private apiUrl = 'http://localhost:8000/api/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(this.apiUrl);
  }

  marcarComoRespondido(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/responder`, {});
  }

  eliminarMensaje(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
