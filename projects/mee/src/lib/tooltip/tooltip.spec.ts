import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/ui/test';
import { TooltipComponent } from './tooltip';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let view: RenderResult<TooltipComponent>;

  beforeEach(async () => {
    view = await render(TooltipComponent, [provideNoopAnimations()]);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
