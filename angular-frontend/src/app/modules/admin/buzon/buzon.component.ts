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
  mensajes: Mensaje[] = [];
  mensajeSeleccionado: Mensaje | null = null;
  respuesta: string = '';

  constructor(private buzonService: BuzonService) {}

  ngOnInit(): void {
    this.buzonService.obtenerMensajes().subscribe((data) => {
      this.mensajes = data;
    });
  }

  seleccionarMensaje(mensaje: Mensaje) {
    this.mensajeSeleccionado = mensaje;
    this.respuesta = '';
  }

 enviarRespuesta() {
    if (this.mensajeSeleccionado) {
      const mensaje = this.mensajeSeleccionado; // copia segura

      this.buzonService.marcarComoRespondido(mensaje.id).subscribe(() => {
        mensaje.respondido = true;
        alert(`Respuesta enviada a ${mensaje.email}:\n\n${this.respuesta}`);
        this.mensajeSeleccionado = null;
        this.respuesta = '';
      });
    }
  }

}