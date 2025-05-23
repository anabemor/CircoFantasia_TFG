import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compra.component.html'
})

export class CompraComponent {
  currentYear = new Date().getFullYear(); 
}