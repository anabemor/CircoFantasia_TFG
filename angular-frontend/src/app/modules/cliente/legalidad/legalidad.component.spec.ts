import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalidadComponent } from './legalidad.component';

describe('LegalidadComponent', () => {
  let component: LegalidadComponent;
  let fixture: ComponentFixture<LegalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
