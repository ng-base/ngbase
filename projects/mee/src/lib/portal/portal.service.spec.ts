import { injectService } from '../test';
import { PortalService } from './portal.service';

describe('PortalService', () => {
  let service: PortalService;

  beforeEach(() => {
    service = injectService(PortalService, [PortalService]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
