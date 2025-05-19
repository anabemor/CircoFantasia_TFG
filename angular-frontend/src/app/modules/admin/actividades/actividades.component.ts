import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent {
  actividades = [
    { id: 1, nombre: 'Taller de acrobacias', descripcion: 'Acrobacias básicas para niños.', fecha: '2025-06-15' },
    { id: 2, nombre: 'Clases de malabares', descripcion: 'Aprende a usar tres pelotas.', fecha: '2025-06-20' },
  ];

  crearActividad() {
    console.log('Crear nueva actividad');
  }

  editarActividad(actividad: any) {
    console.log('Editar actividad:', actividad);
  }

  eliminarActividad(id: number) {
    console.log('Eliminar actividad con ID:', id);
  }
}
