import { Component, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { CompraService } from '../../../../shared/services/compra.service';
import { Router} from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent implements OnInit {
  constructor(private compraService: CompraService, private router: Router) {}

  ngOnInit(): void {
    this.compraService.limpiar();
  }

  volverInicio(): void {
    this.compraService.limpiar(); // opcional si ya limpiaste
    this.router.navigate(['/compra', 'tickets']);
  }
  
   irAContacto(): void {
    this.router.navigate(['/contacto']);
  }
}