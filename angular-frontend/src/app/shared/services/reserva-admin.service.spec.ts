import { TestBed } from '@angular/core/testing';

import { ReservaAdminService } from './reserva-admin.service';

describe('ReservaAdminService', () => {
  let service: ReservaAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
