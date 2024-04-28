import { TestBed } from '@angular/core/testing';

import { ToggleGroupService } from './toggle-group.service';

describe('ToggleGroupService', () => {
  let service: ToggleGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
