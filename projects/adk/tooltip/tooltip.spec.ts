import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbTooltipTemplate } from './tooltip';

describe('TooltipComponent', () => {
  let component: NgbTooltipTemplate;
  let view: RenderResult<NgbTooltipTemplate>;

  beforeEach(async () => {
    view = await render(NgbTooltipTemplate, [provideNoopAnimations()]);
    component = view.host;
    // fake the target
    component['target'] = document.createElement('div');
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
