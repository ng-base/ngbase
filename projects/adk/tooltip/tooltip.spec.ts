import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeTooltipTemplate } from './tooltip';

describe('TooltipComponent', () => {
  let component: MeeTooltipTemplate;
  let view: RenderResult<MeeTooltipTemplate>;

  beforeEach(async () => {
    view = await render(MeeTooltipTemplate, [provideNoopAnimations()]);
    component = view.host;
    // fake the target
    component.target = document.createElement('div');
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
