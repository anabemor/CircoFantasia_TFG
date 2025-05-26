import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResumenPedidoComponent } from '../resumen-pedido/resumen-pedido.component';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, RouterModule, ResumenPedidoComponent],
  templateUrl: './compra.component.html'
})

export class CompraComponent {
  constructor(private router: Router) {}

  get esConfirmacion(): boolean {
    return this.router.url.startsWith('/compra/confirmacion');
  }

  currentYear = new Date().getFullYear(); 
}