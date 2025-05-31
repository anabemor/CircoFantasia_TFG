import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-cliente.component.html',
  styleUrl: './layout-cliente.component.css'
})
export class LayoutClienteComponent {}
