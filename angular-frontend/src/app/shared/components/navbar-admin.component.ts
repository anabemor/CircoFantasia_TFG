import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent {
  constructor(private router: Router) {}

  irAlPanel(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
