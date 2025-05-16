import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  showSignup = false;

  constructor(private fb: FormBuilder) {
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

    const credentials = this.loginForm.value;
    console.log('Login data:', credentials);

    // Aquí llamarías a tu servicio de login
    // this.authService.login(credentials).subscribe(...)
  }

  onPasswordReset(): void {
    // Aquí podrías redirigir o abrir un modal de recuperación
    alert('Password reset not implemented yet.');
  }

  switchToSignup(): void {
    this.showSignup = true;
  }
}
