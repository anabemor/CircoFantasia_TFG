import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-datos-visitante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-visitante.component.html'
})
export class DatosVisitanteComponent implements OnInit {
  nombre = '';
  apellidos = '';
  fechaNacimiento = '';
  email = '';
  confirmarEmail = '';
  telefono = '';
  aceptoCondiciones = false;

  hoy = formatDate(new Date(), 'yyyy-MM-dd', 'es');

  constructor(
    private compraService: CompraService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    if (this.compraService.getTickets().length === 0) {
      this.router.navigate(['/compra/tickets']);
    }
  }

  continuar(form: NgForm): void {
    if (form.invalid) {
      this.toast.warning('Por favor, revisa los campos obligatorios antes de continuar.');
      return;
    }

    if (this.email !== this.confirmarEmail) {
      this.toast.error('Ups! Los emails no coinciden.');
      return;
    }

    const edad = this.calcularEdad(this.fechaNacimiento);
    if (edad < 0 || isNaN(edad)) {
      this.toast.error('Ups! Fecha de nacimiento inválida.');
      return;
    }
    if (edad < 18) {
      this.toast.error('Ups! Debes ser mayor de edad para continuar.');
      return;
    }

    this.compraService.setDatosCliente({
      nombre: this.nombre.trim(),
      apellidos: this.apellidos.trim(),
      fechaNacimiento: this.fechaNacimiento,
      email: this.email.trim(),
      telefono: this.telefono.trim(),
      aceptoCondiciones: this.aceptoCondiciones
    });

    this.router.navigate(['/compra/pago']);
  }

  calcularEdad(fechaString: string): number {
    if (!fechaString) return -1;

    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return -1;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }

  volver(): void {
    this.router.navigate(['/compra/fecha']);
  }
}
