import { TestBed } from '@angular/core/testing';

import { SeparatorService } from './separator.service';

describe('SeparatorService', () => {
  let service: SeparatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeparatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
