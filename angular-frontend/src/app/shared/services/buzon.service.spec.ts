import { TestBed } from '@angular/core/testing';

import { BuzonService } from './buzon.service';

describe('BuzonService', () => {
  let service: BuzonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuzonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
