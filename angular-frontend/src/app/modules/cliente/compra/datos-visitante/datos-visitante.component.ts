import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';
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
  fechaNacimiento = ''; // formato string
  email = '';
  telefono = '';
  confirmarEmail = '';
  aceptoCondiciones = false;

  hoy = new Date().toISOString().split('T')[0];
  
  constructor(
    private compraService: CompraService,
    private reservaService: ReservaService,
    private router: Router,
    private toast: ToastService // 
  ) {}

  continuar() {
    if (!this.todosLosDatosSonValidos()) {
      this.toast.error('Por favor, completa todos los campos correctamente.');
      return;
    }

    const edad = this.calcularEdad(this.fechaNacimiento);
    if (edad < 18) {
      this.toast.error('Ups! Eres menor de edad, no puedes comprar!');
      return;
    }

    this.compraService.setDatosCliente({
      nombre: this.nombre,
      apellidos: this.apellidos,
      fechaNacimiento: this.fechaNacimiento,
      email: this.email,
      telefono: this.telefono,
      aceptoCondiciones: this.aceptoCondiciones
    });

    const reserva = this.compraService.crearReserva();

    if (!reserva) {
      this.toast.error('Error al preparar la reserva. Asegúrate de haber completado todos los pasos.');
      return;
    }

    this.reservaService.enviarReserva(reserva).subscribe({
      next: () => this.router.navigate(['/compra/pago']),
      error: (err) => {
        console.error('Error al guardar la reserva:', err);
        this.toast.error('Hubo un problema al guardar la reserva.');
      }
    });
  }

  todosLosDatosSonValidos(): boolean {
    return (
      this.nombre.trim() !== '' &&
      this.apellidos.trim() !== '' &&
      this.fechaNacimiento !== '' &&
      this.email.trim() !== '' &&
      this.email === this.confirmarEmail &&
      this.telefono.trim() !== '' &&
      this.aceptoCondiciones
    );
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
