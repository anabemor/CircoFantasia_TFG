import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    actionLabel?: string,
    actionCallback?: () => void
  ): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type, actionLabel, actionCallback },
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['no-backdrop-snackbar'] // nombre simple y claro
    });
  }

  // 👇 CAMBIA esta función:
  // error(message: string): void {
  //   this.show(message, 'error');
  // }

  // 👇 POR ESTA:
  error(message: string, actionLabel?: string, actionCallback?: () => void): void {
    this.show(message, 'error', actionLabel, actionCallback);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }
}
