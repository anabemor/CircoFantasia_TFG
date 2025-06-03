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
import { NavbarAdminComponent } from '../../../../shared/components/navbar-admin.component';

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
    MatButtonModule,
    NavbarAdminComponent
  ],
  templateUrl: './historial-reservas.component.html'
})
export class HistorialReservasComponent {
  reservas: Reserva[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  ordenAscendente = true;
  ordenCampo = '';

  // Paginación
  paginaActual = 1;
  tamañoPagina = 15;

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
        this.paginaActual = 1;
        console.log('✅ Reservas filtradas recibidas:', data);
      },
      error: err => {
        console.error('❌ Error al obtener reservas filtradas:', err);
      }
    });
  }

  get reservasPaginaActual(): Reserva[] {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    return this.reservas.slice(inicio, inicio + this.tamañoPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.reservas.length / this.tamañoPagina);
  }

  anteriorPagina(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
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

    const body = this.reservas.map(r => [
      `${r.nombre} ${r.apellidos}`,
      r.email,
      new Date(r.fechaVisita).toLocaleDateString(),
      this.getCantidadPorTipo(r, 'Adulto'),
      this.getCantidadPorTipo(r, 'Niño'),
      `${this.getTotalReserva(r)} €`
    ]);

    // Añadir fila de totales manualmente
    body.push([
      'Totales',
      '',
      '',
      this.getTotalAdultos().toString(),
      this.getTotalNinos().toString(),
      `${this.getTotalPrecio().toFixed(2)} €`
    ]);

    autoTable(doc, {
      head: [['Nombre', 'Email', 'Fecha Visita', 'Adultos', 'Niños', 'Total']],
      body: body,
      theme: 'striped'
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

    // Agregar fila de totales
    datos.push({
      Nombre: 'Totales',
      Email: '',
      'Fecha Visita': '',
      Adultos: this.getTotalAdultos(),
      Niños: this.getTotalNinos(),
      Total: this.getTotalPrecio()
    });

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = { Sheets: { 'Reservas': worksheet }, SheetNames: ['Reservas'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'historial_reservas.xlsx');
  }

  ordenarPor(campo: string): void {
    if (this.ordenCampo === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenCampo = campo;
      this.ordenAscendente = true;
    }

    this.reservas.sort((a, b) => {
      const valorA = this.obtenerValorParaOrden(a, campo);
      const valorB = this.obtenerValorParaOrden(b, campo);

      if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
      return 0;
    });

    this.paginaActual = 1;
  }

  obtenerValorParaOrden(reserva: Reserva, campo: string): any {
    switch (campo) {
      case 'nombre': return reserva.nombre?.toLowerCase();
      case 'email': return reserva.email?.toLowerCase();
      case 'fechaVisita': return new Date(reserva.fechaVisita);
      default: return '';
    }
  }


}
