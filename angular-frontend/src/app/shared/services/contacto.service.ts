import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MensajeContacto {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  contenido: string;
}

@Injectable({ providedIn: 'root' })
export class ContactoService {
  private apiUrl = 'http://localhost:8000/api/mensajes';

  constructor(private http: HttpClient) {}

  enviarMensaje(data: MensajeContacto): Observable<any> {
    const headers = new HttpHeaders({ Authorization: '' }); // ← aquí vaciamos el token
    return this.http.post(this.apiUrl, data);
  }
}
