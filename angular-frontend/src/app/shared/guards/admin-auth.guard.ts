import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.mostrarMensaje('Debes iniciar sesión como administrador.');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.roles && payload.roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        this.mostrarMensaje('Acceso restringido. Solo para administradores.');
        this.router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      this.mostrarMensaje('Token inválido. Vuelve a iniciar sesión.');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: {
        message: mensaje,
        type: 'error' // puedes usar 'success', 'error', etc.
      },
      duration: 4000,
      panelClass: ['custom-snackbar-overlay']
    });
  }

}