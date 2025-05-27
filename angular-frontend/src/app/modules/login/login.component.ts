import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service'// ✅ Ajusta según ruta real
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
     next: (response) => {
      this.authService.saveToken(response.token); // ✅ guardar token

      this.errorMessage = null;
      this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';

      setTimeout(() => {
        this.router.navigate(['/admin']); // o la ruta correspondiente
      }, 1500);
    },
      error: (err: HttpErrorResponse) => {
        console.error('Login fallido', err);
        this.successMessage = null;
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }

   onPasswordReset(): void {
    this.router.navigate(['/recuperar-password']);
  }


  switchToSignup(): void {
    // Lógica para mostrar el formulario de registro si quieres en esta vista
  }
}
