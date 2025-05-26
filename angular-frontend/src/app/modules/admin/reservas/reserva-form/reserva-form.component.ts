import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { TicketTypeService } from '../../../../shared/services/ticket-type.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
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
  ticketTypes: TicketType[] = [];

  constructor(private fb: FormBuilder, private ticketService: TicketTypeService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaVisita: ['', Validators.required],
      aceptoCondiciones: [false, Validators.requiredTrue],
      tickets: this.fb.array([])
    });

    this.ticketService.getTiposTicket().subscribe(tipos => {
      this.ticketTypes = tipos;
      this.initTickets();
    });

    if (this.reserva) {
      this.form.patchValue({ ...this.reserva });
    }
  }

  get tickets(): FormArray {
    return this.form.get('tickets') as FormArray;
  }

  initTickets() {
    this.ticketTypes.forEach(ticket => {
      const cantidad = this.reserva?.tickets.find(t => t.ticketType.id === ticket.id)?.cantidad || 0;
      this.tickets.push(
        this.fb.group({
          ticketType: [ticket],
          cantidad: [cantidad, [Validators.min(0)]]
        })
      );
    });
  }

  submit() {
    const raw = this.form.getRawValue();

    const reserva: Reserva = {
      ...raw,
      fechaNacimiento: this.formatFecha(raw.fechaNacimiento),
      fechaVisita: this.formatFecha(raw.fechaVisita),
      fechaReserva: new Date().toISOString(),
      tickets: raw.tickets
        .filter((t: any) => t.cantidad > 0)
        .map((t: any) => ({
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

  private formatFecha(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}
