import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.warning('Por favor, revisa los campos del formulario.');
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ name: fullName, email, password }).subscribe({
      next: () => {
        this.toast.success('Usuario registrado correctamente. Redirigiendo al login...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Registro fallido', err);

        // Eliminar token inválido si está presente
        if (err.status === 401 && err.error?.message?.includes('Invalid JWT Token')) {
          localStorage.removeItem('token');
        }

        // Mostrar diálogo si ya hay un usuario o el token es inválido
        if (
          (err.status === 403 && err.error?.error) ||
          (err.status === 401 && err.error?.message?.includes('Invalid JWT Token'))
        ) {
          this.dialog.open(ConfirmDialogComponent, {
            data: {
              titulo: 'Ya existe un usuario registrado',
              mensaje: '¿Quieres iniciar sesión ahora?',
              soloAceptar: false
            }
          }).afterClosed().subscribe((result: boolean) => {
            if (result) {
              this.router.navigate(['/login']); // Aceptar → ir al login
            }
            // Cancelar → quedarse en el formulario
          });
        } else if (err.error?.error) {
          this.toast.error(err.error.error);
        } else {
          this.toast.error('El registro ha fallado. Intenta con otro correo.');
        }
      }
    });
  }
}

