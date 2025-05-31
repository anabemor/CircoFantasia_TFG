import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contacto-form.component.html',
  styleUrl: './contacto-form.component.css'
})
export class ContactoFormComponent {
  contactoForm!: FormGroup;
  enviando = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar(): void {
    if (this.contactoForm.invalid) {
      this.snackBar.open('Por favor, rellena todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.enviando = true;

    // Simula envío con un retardo de 2 segundos
    setTimeout(() => {
      console.log('📨 Datos enviados:', this.contactoForm.value);

      this.snackBar.open('Mensaje enviado correctamente', 'Cerrar', {
        duration: 3000
      });

      this.contactoForm.reset();
      this.enviando = false;
    }, 2000);
  }
}
