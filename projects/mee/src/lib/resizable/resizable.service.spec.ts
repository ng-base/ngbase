import { TestBed } from '@angular/core/testing';

import { ResizableService } from './resizable.service';

describe('ResizableService', () => {
  let service: ResizableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
