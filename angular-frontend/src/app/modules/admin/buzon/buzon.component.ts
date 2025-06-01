import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from "../../../shared/components/navbar-admin.component";

interface Mensaje {
  id: number;
  remitente: string;
  asunto: string;
  contenido: string;
  respondido: boolean;
}

@Component({
  selector: 'app-buzon',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarAdminComponent],
  templateUrl: './buzon.component.html',
})
export class BuzonComponent {
  mensajes: Mensaje[] = [
    {
      id: 1,
      remitente: 'cliente1@example.com',
      asunto: 'Consulta horarios',
      contenido: '¿Qué horarios tienen disponibles?',
      respondido: false
    },
    {
      id: 2,
      remitente: 'cliente2@example.com',
      asunto: 'Problema con reserva',
      contenido: 'No he recibido confirmación.',
      respondido: false
    }
  ];

  mensajeSeleccionado: Mensaje | null = null;
  respuesta: string = '';

  seleccionarMensaje(mensaje: Mensaje) {
    this.mensajeSeleccionado = mensaje;
    this.respuesta = '';
  }

  enviarRespuesta() {
    if (this.mensajeSeleccionado) {
      this.mensajeSeleccionado.respondido = true;
      alert(`Respuesta enviada a ${this.mensajeSeleccionado.remitente}:\n\n${this.respuesta}`);
      this.mensajeSeleccionado = null;
      this.respuesta = '';
    }
  }
}
