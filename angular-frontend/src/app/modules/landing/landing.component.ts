import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Importa FormsModule

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, FormsModule], // ✅ Añade FormsModule aquí
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  username: any;
  password: any;

  onSubmit() {
    console.log('Usuario:', this.username, 'Contraseña:', this.password);
    // Aquí podrías hacer validación o navegación
  }
}
