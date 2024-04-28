import { TestBed } from '@angular/core/testing';

import { TypographyService } from './typography.service';

describe('TypographyService', () => {
  let service: TypographyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypographyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
