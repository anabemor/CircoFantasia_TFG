import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { BuzonService, Mensaje } from '../../../shared/services/buzon.service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-buzon',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarAdminComponent],
  templateUrl: './buzon.component.html',
})
export class BuzonComponent implements OnInit {
  mensajes: (Mensaje & { seleccionado?: boolean })[] = [];
  mensajeSeleccionado: (Mensaje & { seleccionado?: boolean }) | null = null;
  respuesta: string = '';
  filtro: string = '';

  constructor(
    private buzonService: BuzonService,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.buzonService.obtenerMensajes().subscribe((data) => {
      // Añadimos propiedad "seleccionado" para selección múltiple
      this.mensajes = data.map(m => ({ ...m, seleccionado: false }));
    });
  }

  get mensajesFiltrados(): (Mensaje & { seleccionado?: boolean })[] {
    const texto = this.filtro.toLowerCase().trim();
    if (!texto) return this.mensajes;

    return this.mensajes.filter(m => {
      const fechaFormateada = new Date(m.fecha).toLocaleDateString('es-ES');
      return (
        m.nombre.toLowerCase().includes(texto) ||
        m.asunto.toLowerCase().includes(texto) ||
        m.contenido.toLowerCase().includes(texto) ||
        fechaFormateada.includes(texto)
      );
    });
  }

  get mensajesSeleccionados(): (Mensaje & { seleccionado?: boolean })[] {
    return this.mensajes.filter(m => m.seleccionado);
  }

  seleccionarMensaje(mensaje: Mensaje) {
    this.mensajeSeleccionado = mensaje;
    this.respuesta = '';
  }

  enviarRespuesta() {
    if (this.mensajeSeleccionado) {
      const mensaje = this.mensajeSeleccionado;

      setTimeout(() => {
        mensaje.respondido = true;

        // Mostrar dialog en lugar de toast
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            titulo: 'Respuesta enviada',
            mensaje: `Respuesta enviada a ${mensaje.email}:\n\n${this.respuesta}`,
            soloAceptar: true
          }
        });

        this.mensajeSeleccionado = null;
        this.respuesta = '';
      }, 1000);
    }
  }

 eliminarSeleccionados(): void {
    const idsAEliminar = this.mensajesSeleccionados.map(m => m.id);

    if (idsAEliminar.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: `¿Seguro que quieres eliminar ${idsAEliminar.length} mensaje(s)?`
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (!resultado) return; // Cancelado

      let eliminados = 0;

      idsAEliminar.forEach(id => {
        this.buzonService.eliminarMensaje(id).subscribe(() => {
          eliminados++;

          if (eliminados === idsAEliminar.length) {
            this.buzonService.obtenerMensajes().subscribe((data) => {
              this.mensajes = data.map(m => ({ ...m, seleccionado: false }));
              this.mensajeSeleccionado = null;
              this.respuesta = '';
            });
          }
        });
      });
    });
  }
}