import { TestBed } from '@angular/core/testing';

import { CheckboxService } from './checkbox.service';

describe('CheckboxService', () => {
  let service: CheckboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
