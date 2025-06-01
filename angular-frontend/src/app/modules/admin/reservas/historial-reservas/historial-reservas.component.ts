import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../../shared/services/reserva-admin.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './historial-reservas.component.html'
})
export class HistorialReservasComponent {
  reservas: Reserva[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  constructor(private reservaService: ReservaAdminService) {
    this.filtrarReservas();
  }

  filtrarReservas(): void {
    const params: any = {};
    if (this.fechaInicio) params.fechaInicio = this.fechaInicio.toISOString().split('T')[0];
    if (this.fechaFin) params.fechaFin = this.fechaFin.toISOString().split('T')[0];

    this.reservaService.getReservasFiltradas(params).subscribe(data => {
      this.reservas = data;
    });
  }

  getCantidadPorTipo(reserva: Reserva, tipoNombre: string): number {
    const ticket = reserva.tickets.find(t => t.ticketType.nombre.toLowerCase() === tipoNombre.toLowerCase());
    return ticket ? ticket.cantidad : 0;
  }

  getTotalReserva(reserva: Reserva): number {
    return reserva.tickets.reduce((suma, t) => suma + (t.ticketType.precio * t.cantidad), 0);
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Nombre', 'Email', 'Fecha Visita', 'Adultos', 'Niños', 'Total']],
      body: this.reservas.map(r => [
        `${r.nombre} ${r.apellidos}`,
        r.email,
        new Date(r.fechaVisita).toLocaleDateString(),
        this.getCantidadPorTipo(r, 'Adulto'),
        this.getCantidadPorTipo(r, 'Niño'),
        `${this.getTotalReserva(r)} €`
      ])
    });
    doc.save('historial_reservas.pdf');
  }

  exportarExcel(): void {
    const datos = this.reservas.map(r => ({
      Nombre: `${r.nombre} ${r.apellidos}`,
      Email: r.email,
      'Fecha Visita': new Date(r.fechaVisita).toLocaleDateString(),
      Adultos: this.getCantidadPorTipo(r, 'Adulto'),
      Niños: this.getCantidadPorTipo(r, 'Niño'),
      Total: this.getTotalReserva(r)
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = { Sheets: { 'Reservas': worksheet }, SheetNames: ['Reservas'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'historial_reservas.xlsx');
  }
}
