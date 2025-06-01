import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    // ⛔ No hay token → redirigir a login con aviso
    if (!token) {
      this.mostrarMensaje('Debes iniciar sesión como administrador.');
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: true },
        replaceUrl: true
      });
      return false;
    }

    try {
      // 🔐 Decodificar payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000); // Timestamp actual

      // ⏳ Verificar si el token ha caducado
      if (payload.exp && payload.exp < ahora) {
        this.mostrarMensaje('Tu sesión ha caducado.');
        this.router.navigate(['/login'], {
          queryParams: { sessionExpired: true },
          replaceUrl: true
        });
        return false;
      }

      // ✅ Verificar si tiene el rol de administrador
      if (payload.roles && payload.roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        this.mostrarMensaje('Acceso restringido. Solo para administradores.');
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }

    } catch (e) {
      // ⚠️ Token mal formado o inválido
      this.mostrarMensaje('Token inválido. Vuelve a iniciar sesión.');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: {
        message: mensaje,
        type: 'error' // Puedes cambiar a 'info', 'success', etc. según tu ToastComponent
      },
      duration: 4000,
      panelClass: ['custom-snackbar-overlay']
    });
  }
}
