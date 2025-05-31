import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ],
  templateUrl: './contacto-form.component.html',
  styleUrl: './contacto-form.component.css'
})
export class ContactoFormComponent {
  contactoForm!: FormGroup;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar(): void {
    if (this.contactoForm.invalid) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          titulo: 'Formulario incompleto',
          mensaje: 'Por favor, rellena todos los campos correctamente.',
          soloAceptar: true
        }
      });
      return;
    }

    this.enviando = true;

    setTimeout(() => {
      console.log('📨 Datos enviados:', this.contactoForm.value);

      this.contactoForm.reset();
      this.enviando = false;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          titulo: 'Mensaje enviado',
          mensaje: 'Tu mensaje ha sido enviado correctamente.',
          soloAceptar: true
        }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/compra/tickets']);
      });
    }, 2000);
  }

  volver(): void {
    this.router.navigate(['/compra/tickets']);
  }

}
