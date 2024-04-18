import { TestBed } from '@angular/core/testing';

import { AccordionService } from './accordion.service';

describe('AccordionService', () => {
  let service: AccordionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccordionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
