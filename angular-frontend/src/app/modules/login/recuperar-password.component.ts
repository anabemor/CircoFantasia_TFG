import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html',
})
export class RecuperarPasswordComponent {
  email = '';
  enviado = false;

  constructor(
    private router: Router,
    private toast: ToastService
  ) {}

  recuperar(form: NgForm): void {
    if (!this.email || !this.email.includes('@')) {
      form.controls['email']?.markAsTouched(); // Forzar error visual
      this.toast.warning('Por favor, introduce un correo electrónico válido.');
      return;
    }

    this.enviado = true;
    this.toast.success('Enlace de recuperación enviado. Redirigiendo al login...');
    setTimeout(() => this.router.navigate(['/login']), 5000);
  }

  volver(): void {
    this.router.navigate(['/login']);
  }
}
