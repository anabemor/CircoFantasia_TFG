import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout-cliente.component.html',
  styleUrl: './layout-cliente.component.css'
})
export class LayoutClienteComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    document.body.classList.add('cliente-app');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('cliente-app');
  }
}
