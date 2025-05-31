import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold text-gray-800">{{ data.titulo }}</h2>

    <mat-dialog-content class="my-4 text-gray-700">
      {{ data.mensaje }}
    </mat-dialog-content>

    <mat-dialog-actions [align]="data.soloAceptar ? 'center' : 'end'" class="flex gap-2">
      <!-- Botón único centrado -->
      <button *ngIf="data.soloAceptar" mat-flat-button color="primary" (click)="onConfirm()">Aceptar</button>

      <!-- Botones confirmación/cancelación -->
      <ng-container *ngIf="!data.soloAceptar">
        <button mat-stroked-button (click)="onCancel()">Cancelar</button>
        <button mat-flat-button color="warn" (click)="onConfirm()">Confirmar</button>
      </ng-container>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      mensaje: string;
      soloAceptar?: boolean;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
