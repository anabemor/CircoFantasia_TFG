import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html',
})
  export class RecuperarPasswordComponent {
  [x: string]: any;
    email = '';
    enviado = false;

    constructor(private router: Router) {}

    recuperar(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.enviado = true;
    setTimeout(() => this.router.navigate(['/login']), 3000);
  }

  volver() {
    this.router.navigate(['/login']);
  }

}