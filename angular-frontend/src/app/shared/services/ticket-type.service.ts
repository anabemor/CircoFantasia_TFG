import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketType } from '../interfaces/ticket-type.interface';


@Injectable({ providedIn: 'root' })
export class TicketTypeService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTiposTicket() {
    return this.http.get<TicketType[]>(`${this.baseUrl}/ticket_types`);
  }
}
