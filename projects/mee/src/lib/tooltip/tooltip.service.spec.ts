import { injectService } from '@meeui/ui/test';
import { TooltipService } from './tooltip.service';

describe('TooltipService', () => {
  let service: TooltipService;

  beforeEach(() => {
    service = injectService(TooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
