import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionFechaComponent } from './seleccion-fecha.component';

describe('SeleccionFechaComponent', () => {
  let component: SeleccionFechaComponent;
  let fixture: ComponentFixture<SeleccionFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionFechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
