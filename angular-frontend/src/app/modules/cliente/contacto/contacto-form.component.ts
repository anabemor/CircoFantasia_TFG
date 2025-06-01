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
import { ContactoService, MensajeContacto } from '../../../shared/services/contacto.service';

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
    private router: Router,
    private contactoService: ContactoService
  ) {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: ['', Validators.required],
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

    const datos: MensajeContacto = {
      nombre: this.contactoForm.value.nombre,
      email: this.contactoForm.value.email,
      telefono: this.contactoForm.value.telefono,
      asunto: this.contactoForm.value.asunto,// Puedes usar selector más adelante
      contenido: this.contactoForm.value.mensaje,
    };
    console.log('📤 Datos que se van a enviar:', datos);

    this.contactoService.enviarMensaje(datos).subscribe({
      next: () => {
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
      },
      error: (err) => {
        console.error('❌ Error al enviar el mensaje:', err);
        this.enviando = false;
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            titulo: 'Error',
            mensaje: 'Ocurrió un error al enviar el mensaje. Intenta de nuevo más tarde.',
            soloAceptar: true
          }
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/compra/tickets']);
  }
}
