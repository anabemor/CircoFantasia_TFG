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
    const huboSesion = localStorage.getItem('huboSesion') === 'true';

    // ⛔ No hay token → redirigir a login SIN mensaje si nunca hubo sesión
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: huboSesion ? 'true' : null },
        replaceUrl: true
      });
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);

      // ⏳ Token expirado
      if (payload.exp && payload.exp < ahora) {
        if (huboSesion) {
          this.mostrarMensaje('Tu sesión ha caducado.');
        }
        this.router.navigate(['/login'], {
          queryParams: { sessionExpired: huboSesion ? 'true' : null },
          replaceUrl: true
        });
        return false;
      }

      // ✅ Verificar rol de administrador
      if (payload.roles && payload.roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        this.mostrarMensaje('Acceso restringido. Solo para administradores.');
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }

    } catch (e) {
      this.mostrarMensaje('Token inválido. Vuelve a iniciar sesión.');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: {
        message: mensaje,
        type: 'error'
      },
      duration: 4000,
      panelClass: ['custom-snackbar-overlay']
    });
  }
}
