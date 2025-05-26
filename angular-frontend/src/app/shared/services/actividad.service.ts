import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad } from '../interfaces/actividad.interface';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private baseUrl = 'http://localhost:8000/api/actividades';

  constructor(private http: HttpClient) {}

  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.baseUrl);
  }

  crearActividad(actividad: Actividad): Observable<any> {
    return this.http.post(this.baseUrl, actividad);
  }

  actualizarActividad(id: number, actividad: Actividad): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, actividad);
  }

  eliminarActividad(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

   getActividadActiva(): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.baseUrl}/activa`);
   }
}
