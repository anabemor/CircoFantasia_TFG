import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login/login.component'; // ✅ Ruta correcta

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {}