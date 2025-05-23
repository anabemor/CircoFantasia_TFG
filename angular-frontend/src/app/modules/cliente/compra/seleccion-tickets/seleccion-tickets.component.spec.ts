import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionTicketsComponent } from './seleccion-tickets.component';

describe('SeleccionTicketsComponent', () => {
  let component: SeleccionTicketsComponent;
  let fixture: ComponentFixture<SeleccionTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
