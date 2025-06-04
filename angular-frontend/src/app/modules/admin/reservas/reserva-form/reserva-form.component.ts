import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

import { TicketTypeService } from '../../../../shared/services/ticket-type.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';
import { ToastService } from '../../../../shared/services/toast.service'; // ✅ nuevo

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule
  ],
  templateUrl: './reserva-form.component.html'
})
export class ReservaFormComponent implements OnInit {
  @Input() reserva: Reserva | null = null;
  @Output() formSubmit = new EventEmitter<Reserva>();

  form!: FormGroup;
  ticketResumen: { nombre: string, precio: number, cantidad: number }[] = [];
  esEdicion: boolean = false;
  ordenCampo: string = '';
  ordenAscendente: boolean = true;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketTypeService,
    private router: Router,
    private toast: ToastService // ✅ sustituye a snackBar
  ) {}

  ngOnInit(): void {
    this.esEdicion = !!this.reserva;

    this.form = this.fb.group({
      nombre: [{ value: this.reserva?.nombre || '', disabled: true }],
      apellidos: [{ value: this.reserva?.apellidos || '', disabled: true }],
      fechaNacimiento: [{ value: this.reserva?.fechaNacimiento || '', disabled: true }],
      email: [
        this.reserva?.email || '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
      ],
      telefono: [
        this.reserva?.telefono || '',
        [Validators.required, Validators.pattern(/^[0-9]{9}$/)]
      ],
      fechaVisita: [{ value: this.reserva?.fechaVisita || '', disabled: true }],
      estado: [this.reserva?.estado || 'pendiente', Validators.required]
    });

    if (this.reserva) {
      this.ticketResumen = this.reserva.tickets.map(t => ({
        nombre: t.ticketType.nombre,
        precio: t.ticketType.precio,
        cantidad: t.cantidad
      }));
    }
  }

  getPrecioTotal(): number {
    return this.ticketResumen.reduce((total, t) => total + t.precio * t.cantidad, 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.toast.error('Formulario no válido');
      return;
    }

    if (!this.reserva) return;

    const estadoActual = this.reserva.estado;
    const nuevoEstado = this.form.value.estado;

    const updatedReserva: Reserva = {
      ...this.reserva,
      email: this.form.value.email,
      telefono: this.form.value.telefono,
      estado: estadoActual === 'pendiente' ? nuevoEstado : estadoActual
    };

    this.formSubmit.emit(updatedReserva);
    this.toast.success('Cambios guardados con éxito');
  }

  volver(): void {
    window.location.href = '/admin/reservas';
  }
}
