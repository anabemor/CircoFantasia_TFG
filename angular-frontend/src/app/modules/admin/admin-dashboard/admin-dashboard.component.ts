import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{
     nombreAdmin: string = '';

    constructor(private authService: AuthService) {}

   ngOnInit(): void {
    this.nombreAdmin = this.authService.getNombreUsuario() || '';
  }

    logout(): void {
      this.authService.logout();
  }
}