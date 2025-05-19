import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, UsuariosService } from '../../../shared/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  mostrarModal: boolean = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error cargando usuarios:', err),
    });
  }

  crearUsuario(): void {
    this.usuarioSeleccionado = {
      name: '',
      email: '',
      roles: ['ROLE_USER'], // valor por defecto
    };
    this.mostrarModal = true; 
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = {
      ...usuario,
      roles: usuario.roles ?? ['ROLE_USER'], // aseguramos array válido
    };
    this.mostrarModal = true;
  }

  eliminarUsuario(id: number): void {
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error al eliminar usuario:', err),
    });
  }

  guardarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    const { id } = this.usuarioSeleccionado;

    const callback = () => {
      this.cargarUsuarios();
      this.cerrarModal();
    };

    if (id) {
      this.usuariosService.actualizarUsuario(id, this.usuarioSeleccionado).subscribe({
        next: callback,
        error: (err) => console.error('Error al editar usuario:', err),
      });
    } else {
      this.usuariosService.crearUsuario(this.usuarioSeleccionado).subscribe({
        next: callback,
        error: (err) => console.error('Error al crear usuario:', err),
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }
}
