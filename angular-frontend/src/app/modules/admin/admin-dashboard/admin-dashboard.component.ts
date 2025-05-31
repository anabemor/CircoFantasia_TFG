import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ AÑADIDO
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ IMPORTACIÓN CORRECTA
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
    constructor(private authService: AuthService) {}

    logout(): void {
      this.authService.logout();
    }
  }
