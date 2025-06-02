import { ToastService } from './../../shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  mensajeSesionCaducada: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Detectar si la sesión ha caducado (viene desde el guard)
    this.route.queryParams.subscribe(params => {
    const logoutManual = localStorage.getItem('logoutManual') === 'true';

    if (params['sessionExpired'] && !logoutManual) {
      this.mensajeSesionCaducada = 'La sesión ha caducado. Por favor, vuelve a iniciar sesión.';
    }

    localStorage.removeItem('logoutManual'); // Limpia la marca
  });
} 

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.warning('Por favor, revise sus datos e intente nuevamente');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('huboSesion', 'true'); // Marcamos que hubo sesión
        this.authService.saveToken(response.token); // Guardar token

        this.errorMessage = null;
        this.mensajeSesionCaducada = '';

        this.toast.success('Inicio de sesión exitoso. Redirigiendo...');

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login fallido', err);
        this.successMessage = null;

        this.toast.error('Correo electrónico o contraseña inválida, por favor, revise sus datos');
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
