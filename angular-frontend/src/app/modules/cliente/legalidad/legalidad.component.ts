import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legalidad',
  templateUrl: './legalidad.component.html',
  styleUrls: ['./legalidad.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class LegalidadComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

   volver(): void {
    this.router.navigate(['/compra/tickets']);
  }
}

