import { TestBed } from '@angular/core/testing';

import { SliderService } from './slider.service';

describe('SliderService', () => {
  let service: SliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SliderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
