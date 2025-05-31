import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent {
   constructor(private authService: AuthService) {}

  irAlPanel(): void {
    this.authService.logout(); // <-- usa el centralizado
  }

  logout(): void {
    this.authService.logout(); // <-- usa el centralizado
  }
}
