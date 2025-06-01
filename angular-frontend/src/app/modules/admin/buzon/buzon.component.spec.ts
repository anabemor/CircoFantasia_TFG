import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonComponent } from './buzon.component';

describe('BuzonComponent', () => {
  let component: BuzonComponent;
  let fixture: ComponentFixture<BuzonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuzonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuzonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
