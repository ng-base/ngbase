import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbTooltipTemplate, tooltipAnimation } from './tooltip';
import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: '[ngbTooltip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ content() }}`,
  animations: [tooltipAnimation],
})
class TestTooltipTemplate extends NgbTooltipTemplate {}

describe('TooltipComponent', () => {
  let component: TestTooltipTemplate;
  let view: RenderResult<TestTooltipTemplate>;

  beforeEach(async () => {
    view = await render(TestTooltipTemplate, [provideNoopAnimations()]);
    component = view.host;
    // fake the target
    component['target'].set(document.createElement('div'));
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the position when the target is set', () => {
    jest.spyOn(component, 'setPosition');
    component['target'].set(document.createElement('div'));
    view.detectChanges();
    expect(component['setPosition']).toHaveBeenCalled();
  });

  it('should set the position when the content is set', () => {
    jest.spyOn(component, 'setPosition');
    component['content'].set('test');
    view.detectChanges();
    expect(component['setPosition']).toHaveBeenCalled();
  });
});
