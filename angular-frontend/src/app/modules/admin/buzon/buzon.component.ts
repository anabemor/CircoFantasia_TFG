import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../../shared/components/navbar-admin.component';
import { BuzonService, Mensaje } from '../../../shared/services/buzon.service';

@Component({
  selector: 'app-buzon',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarAdminComponent],
  templateUrl: './buzon.component.html',
})
export class BuzonComponent implements OnInit {
  mensajes: (Mensaje & { seleccionado?: boolean })[] = [];
  mensajeSeleccionado: (Mensaje & { seleccionado?: boolean }) | null = null;
  respuesta: string = '';
  filtro: string = '';

  constructor(private buzonService: BuzonService) {}

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

      // Simulación visual
      setTimeout(() => {
        this.buzonService.marcarComoRespondido(mensaje.id).subscribe(() => {
          mensaje.respondido = true;
          alert(`Respuesta enviada a ${mensaje.email}:\n\n${this.respuesta}`);
          this.mensajeSeleccionado = null;
          this.respuesta = '';
        });
      }, 1000);
    }
  }

 eliminarSeleccionados(): void {
    const idsAEliminar = this.mensajesSeleccionados.map(m => m.id);

    if (idsAEliminar.length === 0) return;

    if (!confirm(`¿Seguro que quieres eliminar ${idsAEliminar.length} mensaje(s)?`)) return;

    let eliminados = 0;

    idsAEliminar.forEach(id => {
      this.buzonService.eliminarMensaje(id).subscribe(() => {
        eliminados++;

        // Solo recargamos la lista una vez al final
        if (eliminados === idsAEliminar.length) {
          this.buzonService.obtenerMensajes().subscribe((data) => {
            this.mensajes = data.map(m => ({ ...m, seleccionado: false }));
            this.mensajeSeleccionado = null;
            this.respuesta = '';
          });
        }
      });
    });
  }
}
