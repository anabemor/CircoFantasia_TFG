import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../../shared/services/compra.service';
import { ReservaService } from '../../../../shared/services/reserva.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-resumen-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-pago.component.html'
})
export class ResumenPagoComponent {
  isLoading = false;

  constructor(
    public compraService: CompraService,
    private reservaService: ReservaService,
    private router: Router,
    private toast: ToastService
  ) {}

  total(): number {
    return this.compraService.getTickets().reduce(
      (sum, ticket) => sum + ticket.precio * ticket.cantidad,
      0
    );
  }

  pagar(): void {
    console.log('💥 pagar() ejecutado');
    console.trace();

    if (this.isLoading) return;

    const reserva = this.compraService.crearReserva();
    console.log('🧾 Reserva generada:', reserva);

    if (!reserva) {
      this.toast.warning('No se puede generar la reserva. Faltan datos.');
      return;
    }

    this.isLoading = true;

    // Simulación de pago
    setTimeout(() => {
      this.reservaService.enviarReserva(reserva).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/compra/confirmacion']);
        },
        error: err => {
          this.isLoading = false;
          console.error('Error al guardar la reserva:', err);
          this.toast.error('Hubo un error al realizar el pago o guardar la reserva.');
        }
      });
    }, 2000);
  }

  volver(): void {
    this.router.navigate(['/compra/datos']);
  }
}
