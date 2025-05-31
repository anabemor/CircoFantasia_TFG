import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-datos-visitante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-visitante.component.html'
})
export class DatosVisitanteComponent {
  nombre = '';
  apellidos = '';
  fechaNacimiento = '';
  email = '';
  confirmarEmail = '';
  telefono = '';
  aceptoCondiciones = false;

  hoy = new Date().toISOString().split('T')[0];
  
  constructor(
    private compraService: CompraService,
    private router: Router,
    private toast: ToastService
  ) {}

  continuar() {
    const edad = this.calcularEdad(this.fechaNacimiento);

    if (!this.todosLosDatosSonValidos(edad)) {
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

  todosLosDatosSonValidos(edad: number): boolean {
    if (this.nombre.trim().length < 3) {
      this.toast.error('Ups! El nombre debe tener al menos 3 letras.');
      return false;
    }

    if (this.apellidos.trim().length < 3) {
      this.toast.error('Ups! El apellido debe tener al menos 3 letras.');
      return false;
    }

    if (!this.fechaNacimiento) {
      this.toast.error('Ups! La fecha de nacimiento es obligatoria.');
      return false;
    }

    if (edad < 18) {
      this.toast.error('Ups! Debes ser mayor de edad para continuar.');
      return false;
    }

    if (!this.email.includes('@') || !this.email.endsWith('.com')) {
      this.toast.error('Ups! El email debe contener "@" y terminar en ".com".');
      return false;
    }

    if (this.email !== this.confirmarEmail) {
      this.toast.error('Ups! Los emails no coinciden.');
      return false;
    }

    if (!/^\d{9}$/.test(this.telefono)) {
      this.toast.error('Ups! El teléfono debe contener exactamente 9 dígitos.');
      return false;
    }

    if (!this.aceptoCondiciones) {
      this.toast.error('Ups! Debes aceptar las condiciones para continuar.');
      return false;
    }

    return true;
  }

  calcularEdad(fechaString: string): number {
    const fecha = new Date(fechaString);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
}
