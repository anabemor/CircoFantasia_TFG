import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios = [
    { id: 1, name: 'Ana Admin', email: 'ana@ejemplo.com', role: 'admin' },
    { id: 2, name: 'Carlos Cliente', email: 'carlos@ejemplo.com', role: 'cliente' },
  ];

  crearUsuario() {
    // Aquí podrías abrir un modal o redirigir a un formulario
    console.log('Crear usuario');
  }

  editarUsuario(usuario: any) {
    // Lógica para editar
    console.log('Editar', usuario);
  }

  eliminarUsuario(id: number) {
    // Lógica para eliminar
    console.log('Eliminar usuario con ID:', id);
  }
}
