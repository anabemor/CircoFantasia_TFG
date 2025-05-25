import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';

@Component({
  selector: 'app-resumen-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-pago.component.html'
})
export class ResumenPagoComponent {
  constructor(
    public compraService: CompraService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  total(): number {
    return this.compraService.getTickets().reduce(
      (sum, ticket) => sum + ticket.precio * ticket.cantidad,
      0
    );
  }

  isLoading = false;

pagar(): void {
  const reserva = this.compraService.crearReserva();
  if (!reserva) {
    alert('No se puede generar la reserva. Faltan datos.');
    return;
  }

  this.isLoading = true;

  // Simulación de carga (2 segundos)
  setTimeout(() => {
    this.reservaService.enviarReserva(reserva).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/compra/confirmacion']);
      },
      error: err => {
        this.isLoading = false;
        console.error('Error al guardar la reserva:', err);
        alert('Hubo un error al realizar el pago o guardar la reserva.');
      }
    });
  }, 2000);
}
}
