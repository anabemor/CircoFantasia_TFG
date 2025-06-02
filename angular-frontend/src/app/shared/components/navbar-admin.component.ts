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
    constructor(
      private authService: AuthService, 
      private router: Router) {}

   irAlPanel(): void {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.router.navigate(['/admin']); // o la ruta principal de admin que prefieras
      } else {
        this.router.navigate(['/login']);
      }
    }
    
  logout(): void {
    this.authService.logout(); // <-- usa el centralizado
  }
}
