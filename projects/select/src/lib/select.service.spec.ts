import { TestBed } from '@angular/core/testing';

import { SelectService } from './select.service';

describe('SelectService', () => {
  let service: SelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
