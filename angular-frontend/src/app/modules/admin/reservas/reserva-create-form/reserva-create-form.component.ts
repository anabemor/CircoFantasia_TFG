import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

import { TicketTypeService } from '../../../../shared/services/ticket-type.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';

@Component({
  selector: 'app-reserva-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './reserva-create-form.component.html'
})
export class ReservaCreateFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Reserva>();

  form!: FormGroup;
  ticketTypes: TicketType[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      fechaVisita: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      tickets: this.fb.array([])
    });

    this.ticketService.getTiposTicket().subscribe(tipos => {
      this.ticketTypes = tipos;
      console.log('TICKETS CARGADOS:', this.ticketTypes);
      this.initTickets();
    });
  }

  get tickets(): FormArray {
    return this.form.get('tickets') as FormArray;
  }

  initTickets(): void {
    this.tickets.clear();

    this.ticketTypes.forEach(ticket => {
      this.tickets.push(this.fb.group({
        ticketType: [ticket],
        cantidad: [0, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  getPrecioTotal(): number {
    return this.tickets.controls.reduce((total, grupo) => {
      const value = grupo.value;
      return total + (value.ticketType.precio * value.cantidad);
    }, 0);
  }

  submit(): void {
    const raw = this.form.getRawValue();

    const reserva: Reserva = {
      ...raw,
      fechaNacimiento: this.formatFecha(raw.fechaNacimiento),
      fechaVisita: this.formatFecha(raw.fechaVisita),
      fechaReserva: new Date().toISOString(),
      tickets: raw.tickets.map((t: any) => ({
        ticketType: {
          id: t.ticketType.id,
          nombre: t.ticketType.nombre,
          precio: t.ticketType.precio
        },
        cantidad: t.cantidad
      }))
    };

    this.formSubmit.emit(reserva);
  }

  formatFecha(date: any): string {
    if (typeof date === 'string') return date;
    return date?.toISOString().split('T')[0];
  }

  volver(): void {
     window.location.href = '/admin/reservas';
  }
}
