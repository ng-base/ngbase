import { Component } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeToggle } from './toggle';

@Component({
  imports: [MeeToggle],
  template: `<button meeToggle>Toggle</button>`,
})
class TestComponent {}

describe('ToggleComponent', () => {
  let component: MeeToggle;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(MeeToggle);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
