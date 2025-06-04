import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Necesario para ngIf y ngClass
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule], // ✅ Agrega esto
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      message: string,
      type: 'success' | 'error' | 'info' | 'warning',
      actionLabel?: string,
      actionCallback?: () => void
    },
    private snackBarRef: MatSnackBarRef<ToastComponent>
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '';
    }
  }

  get bgColor(): string {
    switch (this.data.type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-300 text-black';
      case 'info': return 'bg-blue-600';
      default: return 'bg-gray-700';
    }
  }

  cerrar(): void {
    this.snackBarRef.dismiss();
  }

  ejecutarAccion(): void {
    if (this.data.actionCallback) {
      this.data.actionCallback();
    }
    this.cerrar();
  }
}
