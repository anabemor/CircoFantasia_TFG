import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  reservas = [
    {
      id: 1,
      nombre: 'Laura Gómez',
      telefono: '612345678',
      email: 'laura@example.com',
      fecha: '2025-06-21',
      hora: '17:00',
      personas: 3,
      estado: 'pagado'
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      telefono: '698765432',
      email: 'juan@example.com',
      fecha: '2025-06-22',
      hora: '18:30',
      personas: 2,
      estado: 'pendiente'
    }
  ];

  crearReserva() {
    console.log('Crear nueva reserva');
  }

  editarReserva(reserva: any) {
    console.log('Editar reserva:', reserva);
  }

  eliminarReserva(id: number) {
    console.log('Eliminar reserva con ID:', id);
  }
}