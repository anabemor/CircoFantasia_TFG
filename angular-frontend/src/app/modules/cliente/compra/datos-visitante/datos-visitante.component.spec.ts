import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosVisitanteComponent } from './datos-visitante.component';

describe('DatosVisitanteComponent', () => {
  let component: DatosVisitanteComponent;
  let fixture: ComponentFixture<DatosVisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosVisitanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
