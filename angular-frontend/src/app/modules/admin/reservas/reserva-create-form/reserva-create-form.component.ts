import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { TicketTypeService } from '../../../../shared/services/ticket-type.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';
import { ReservaService } from '../../../../shared/services/reserva.service';

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
  @Input() aforoError: string | null = null;

  form!: FormGroup;
  ticketTypes: TicketType[] = [];
  fechaMinima: Date = new Date();
  fechasCompletas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketTypeService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarTiposTicket();
    this.cargarFechasConAforoCompleto();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      fechaVisita: ['', Validators.required],
      //estado: ['pendiente', Validators.required],
      tickets: this.fb.array([])
    });
  }

  private cargarTiposTicket(): void {
    this.ticketService.getTiposTicket().subscribe(tipos => {
      this.ticketTypes = tipos;
      const ticketsFormArray = this.form.get('tickets') as FormArray;
      tipos.forEach(tipo => {
        ticketsFormArray.push(
          this.fb.group({
            ticketType: [tipo],
            cantidad: [0, [Validators.required, Validators.min(0)]]
          })
        );
      });
    });
  }

  private cargarFechasConAforoCompleto(): void {
    const fechas = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return formatDate(d, 'yyyy-MM-dd', 'es');
    });

    forkJoin(fechas.map(f => this.reservaService.getAforoPorFecha(f)))
      .subscribe(result => {
        this.fechasCompletas = result
          .filter(r => r.ocupado >= 60)
          .map(r => r.fecha);
      });
  }

  marcarFechasCompletas = (date: Date): string => {
    const fechaStr = formatDate(date, 'yyyy-MM-dd', 'es');
    return this.fechasCompletas.includes(fechaStr) ? 'fecha-completa' : '';
  };

  filtroFechaDisponible = (date: Date | null): boolean => {
    if (!date) return false;
    const fechaStr = formatDate(date, 'yyyy-MM-dd', 'es');
    return !this.fechasCompletas.includes(fechaStr);
  };

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
    if (this.getPrecioTotal() === 0) {
      alert('Debes seleccionar al menos una entrada');
      return;
    }

    const raw = this.form.getRawValue();

    const reserva: Reserva = {
      ...raw,
      fechaNacimiento: this.formatFecha(raw.fechaNacimiento),
      fechaVisita: this.formatFecha(raw.fechaVisita),
      fechaReserva: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'es'),
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

    this.aforoError = null;
    this.formSubmit.emit(reserva);
  }

  formatFecha(date: any): string {
  if (typeof date === 'string') return date;
  return formatDate(date, 'yyyy-MM-dd', 'es'); 
  }

  volver(): void {
    window.location.href = '/admin/reservas';
  }
}
