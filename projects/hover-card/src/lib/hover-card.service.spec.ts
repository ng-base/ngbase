import { TestBed } from '@angular/core/testing';

import { HoverCardService } from './hover-card.service';

describe('HoverCardService', () => {
  let service: HoverCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
