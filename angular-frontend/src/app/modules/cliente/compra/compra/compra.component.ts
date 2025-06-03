import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResumenPedidoComponent } from '../resumen-pedido/resumen-pedido.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, RouterModule, ResumenPedidoComponent],
  templateUrl: './compra.component.html'
})
export class CompraComponent implements OnInit {
  pasoActual = 1;
  totalPasos = 5;
  siguientePaso = '';
  mostrarSiguiente = true;
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Llama al cargar la vista
    this.actualizarPaso(this.router.url);

    // Escucha cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarPaso(this.router.url);
    });
  }

  get esConfirmacion(): boolean {
    return this.router.url.startsWith('/compra/confirmacion');
  }

  private actualizarPaso(url: string): void {
    if (url.includes('visitantes') || url.includes('tickets')) {
      this.pasoActual = 1;
      this.siguientePaso = 'Elección de fecha';
      this.mostrarSiguiente = true;
    } else if (url.includes('fecha')) {
      this.pasoActual = 2;
      this.siguientePaso = 'Datos del visitante';
      this.mostrarSiguiente = true;
    } else if (url.includes('datos')) {
      this.pasoActual = 3;
      this.siguientePaso = 'Simulación de pago';
      this.mostrarSiguiente = true;
    } else if (url.includes('pago')) {
      this.pasoActual = 4;
      this.siguientePaso = 'Confirmación de reserva';
      this.mostrarSiguiente = true;
    } else if (url.includes('confirmacion')) {
      this.pasoActual = 5;
      this.siguientePaso = '';
      this.mostrarSiguiente = false;
    } else {
      this.pasoActual = 1;
      this.siguientePaso = '';
      this.mostrarSiguiente = true;
    }
  }

  get esPantallaPago(): boolean {
    return this.router.url.startsWith('/compra/pago') || this.router.url.startsWith('/compra/confirmacion');
  }

}
