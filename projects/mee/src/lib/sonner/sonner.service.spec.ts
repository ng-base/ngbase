import { TestBed } from '@angular/core/testing';

import { SonnerService } from './sonner.service';

describe('SonnerService', () => {
  let service: SonnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SonnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
