import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Simulando un login exitoso
      if (username === 'admin' && password === 'admin123') {
        console.log('Login exitoso');
        this.router.navigate(['/admin']);  // Redirige a la página de administración
      } else {
        console.log('Credenciales incorrectas');
        alert('Usuario o contraseña incorrectos');
      }
    } else {
      console.log('Formulario inválido');
    }
  }
}


