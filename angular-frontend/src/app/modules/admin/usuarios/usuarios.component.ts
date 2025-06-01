import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, UsuariosService } from '../../../shared/services/usuarios.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component'; // ajusta la ruta si es distinta


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, NavbarAdminComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  mostrarModal: boolean = false;

  
  constructor(
    private usuariosService: UsuariosService,  
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
    

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
      password: '',
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: '¿Estás seguro de que deseas eliminar este usuario?',
        soloAceptar: false
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.usuariosService.eliminarUsuario(id).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }


  guardarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    const { id } = this.usuarioSeleccionado;

    const callback = (mensaje: string) => {
      this.cargarUsuarios();
      this.cerrarModal();
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
    };

    if (id) {
      this.usuariosService.actualizarUsuario(id, this.usuarioSeleccionado).subscribe({
        next: () => callback('Usuario actualizado correctamente'),
        error: (err) => {
          console.error('Error al editar usuario:', err);
          this.snackBar.open('Error al actualizar usuario', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    } else {
      this.usuariosService.crearUsuario(this.usuarioSeleccionado).subscribe({
        next: () => callback('Usuario creado correctamente'),
        error: (err) => {
          console.error('Error al crear usuario:', err);
          this.snackBar.open('Error al crear usuario', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  ordenActual: keyof Usuario | 'rol' | '' = '';
  ordenAscendente: boolean = true;

  ordenarPor(campo: keyof Usuario | 'rol'): void {
  if (this.ordenActual === campo) {
    this.ordenAscendente = !this.ordenAscendente;
  } else {
    this.ordenActual = campo;
    this.ordenAscendente = true;
  }

  this.usuarios.sort((a, b) => {
    let valorA: string;
    let valorB: string;

    if (campo === 'rol') {
      valorA = a.roles.includes('ROLE_ADMIN') ? 'Administrador' : 'Gestor';
      valorB = b.roles.includes('ROLE_ADMIN') ? 'Administrador' : 'Gestor';
    } else {
      valorA = a[campo]?.toString().toLowerCase() ?? '';
      valorB = b[campo]?.toString().toLowerCase() ?? '';
    }

    return this.ordenAscendente
      ? valorA.localeCompare(valorB)
      : valorB.localeCompare(valorA);
  });
}
}