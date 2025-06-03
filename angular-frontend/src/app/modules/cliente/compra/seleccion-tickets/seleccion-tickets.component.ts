import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketTypeService} from '../../../../shared/services/ticket-type.service';
import { CompraService, TicketSeleccionado } from '../../../../shared/services/compra.service';
import { TicketType } from '../../../../shared/interfaces/ticket-type.interface';
import { ActividadService } from '../../../../shared/services/actividad.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-seleccion-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccion-tickets.component.html'
})

export class SeleccionTicketsComponent implements OnInit {
  tiposTicket: TicketType[] = [];
  cantidades: { [id: number]: number } = {};
  actividadNombre: string = '';
  

  constructor(
    private ticketTypeService: TicketTypeService,
    private compraService: CompraService,
    private actividadService: ActividadService,
    private router: Router,
    private toast: ToastService
  ) {}

  getIconoActividad(): string {
    const nombre = this.compraService.getActividad()?.nombre?.toLowerCase() || '';

    if (nombre.includes('halloween')) {
      return '/img/pumpkin_fantasia.png';
    }

    if (nombre.includes('navidad') || nombre.includes('papá noel')) {
      return '/img/navidad_fantasia.png';
    }

    return ''; // si no hay icono aplicable
  }


  ngOnInit(): void {
      this.actividadService.getActividadActiva().subscribe({
      next: (actividad) => {
        console.log('Actividad activa recibida:', actividad);
        this.actividadNombre = actividad.nombre;
        this.compraService.setActividad(actividad);
      },
      error: (err) => {
       console.error('Error al obtener actividad activa:', err);
        alert('No hay una actividad activa en este momento.');
      }
    });

     this.ticketTypeService.getTiposTicket().subscribe((tipos) => {
    this.tiposTicket = tipos.filter(t => t.activo);
    for (let tipo of tipos) {
      this.cantidades[tipo.id] = 0;
    }
  });
}

   restarCantidad(id: number): void {
    this.cantidades[id] = Math.max(0, this.cantidades[id] - 1);
    this.actualizarCompra(); // 👈
  }

  sumarCantidad(id: number): void {
    this.cantidades[id] += 1;
    this.actualizarCompra(); // 👈
  }

  actualizarCompra(): void {
    const seleccionados: TicketSeleccionado[] = this.tiposTicket
      .filter(t => this.cantidades[t.id] > 0)
      .map(t => ({
        id: t.id,
        nombre: t.nombre,
        cantidad: this.cantidades[t.id],
        precio: t.precio
      }));

    this.compraService.setTickets(seleccionados);
  }

  
  continuar(): void {
    const totalEntradas = Object.values(this.cantidades).reduce((sum, n) => sum + n, 0);

     if (totalEntradas === 0) {
      this.toast.warning('Debes seleccionar al menos una entrada');
      return;
    }

    this.router.navigate(['/compra/fecha']);
  }

  
}
