import { render, RenderResult } from '@meeui/ui/test';
import { Portal } from './portal.component';

describe('PortalComponent', () => {
  let component: Portal;
  let view: RenderResult<Portal>;

  beforeEach(async () => {
    view = await render(Portal);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
