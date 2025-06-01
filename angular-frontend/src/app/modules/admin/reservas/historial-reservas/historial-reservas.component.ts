import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Reserva } from '../../../../shared/interfaces/reserva.interface';
import { ReservaAdminService } from '../../../../shared/services/reserva-admin.service';
import { RouterModule } from '@angular/router';

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
    RouterModule,
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
    if (this.fechaInicio) {
      params.fechaInicio = formatDate(this.fechaInicio, 'dd-MM-yyyy', 'es-ES');
    }
    if (this.fechaFin) {
      params.fechaFin = formatDate(this.fechaFin, 'dd-MM-yyyy', 'es-ES');
    }

    console.log('🔍 Parámetros enviados al backend:', params);

    this.reservaService.getReservasFiltradas(params).subscribe({
      next: data => {
        this.reservas = data;
        console.log('✅ Reservas filtradas recibidas:', data);
      },
      error: err => {
        console.error('❌ Error al obtener reservas filtradas:', err);
      }
    });
  }

  getCantidadPorTipo(reserva: Reserva, tipoNombre: string): number {
    if (!reserva.tickets || !Array.isArray(reserva.tickets)) return 0;

    const ticket = reserva.tickets.find(
      t => t.ticketType?.nombre?.toLowerCase() === tipoNombre.toLowerCase()
    );
    return ticket?.cantidad ?? 0;
  }

  getTotalReserva(reserva: Reserva): number {
    if (!reserva.tickets || !Array.isArray(reserva.tickets)) return 0;

    return reserva.tickets.reduce((suma, t) => {
      const precio = t.ticketType?.precio ?? 0;
      const cantidad = t.cantidad ?? 0;
      return suma + (precio * cantidad);
    }, 0);
  }

  getTotalAdultos(): number {
    return this.reservas.reduce((suma, r) => suma + this.getCantidadPorTipo(r, 'Adulto'), 0);
  }

  getTotalNinos(): number {
    return this.reservas.reduce((suma, r) => suma + this.getCantidadPorTipo(r, 'Niño'), 0);
  }

  getTotalPrecio(): number {
    return this.reservas.reduce((suma, r) => suma + this.getTotalReserva(r), 0);
  }

  exportarPDF(): void {
    const confirmar = confirm('¿Deseas generar el PDF del historial de reservas?');
    if (!confirmar) return;

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
    const confirmar = confirm('¿Deseas generar el Excel del historial de reservas?');
    if (!confirmar) return;

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
