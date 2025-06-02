import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // ← CORREGIDO aquí
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog

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

  // Validador para confirmar que las contraseñas coinciden
  passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // FORZAMOS mostrar errores

      console.warn('Formulario inválido');
      console.log('Errores del formulario:', this.registerForm.errors);
      console.log('Valores actuales:', this.registerForm.value);

      this.errorMessage = 'Por favor, revisa los campos del formulario.';
      this.successMessage = null;
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ name: fullName, email, password }).subscribe({
      next: () => {
        this.errorMessage = null;
        this.successMessage = 'Usuario registrado correctamente. Redirigiendo al login...';

        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Registro fallido', err);
        this.successMessage = null;

        if (err.status === 403 && err.error?.error) {
          this.dialog.open(ConfirmDialogComponent, {
            data: { mensaje: 'Ya existe un usuario registrado. Por favor, intenta iniciar sesión.' }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/login']); // ← Redirige al login
          });
        } else if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'El registro ha fallado. Intenta con otro correo.';
        }
      }
          });
        }
}