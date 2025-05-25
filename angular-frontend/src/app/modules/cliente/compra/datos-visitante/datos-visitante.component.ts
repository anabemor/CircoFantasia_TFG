import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';

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
  telefono = '';
  confirmarEmail = '';
  aceptoCondiciones = false;

  constructor(
    private compraService: CompraService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  continuar() {
    if (!this.todosLosDatosSonValidos()) {
      alert('Por favor, completa todos los campos correctamente.');
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
      alert('Error al preparar la reserva. Asegúrate de haber completado todos los pasos.');
      return;
    }

    this.reservaService.enviarReserva(reserva).subscribe({
      next: () => this.router.navigate(['/compra/confirmacion']),
    error: (err) => {
    console.error('Error al guardar la reserva:', err);
    alert('Hubo un problema al guardar la reserva');
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
}
