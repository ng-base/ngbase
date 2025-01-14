import { Component, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeToggleGroup } from './toggle-group';
import { MeeToggleItem } from './toggle-item';

@Component({
  imports: [MeeToggleGroup, MeeToggleItem],
  template: `<div meeToggleGroup [multiple]="multiple()">
    <button meeToggleItem value="1">Item 1</button>
    <button meeToggleItem value="2">Item 2</button>
  </div>`,
})
class TestComponent {
  readonly multiple = signal(false);
}

describe('ToggleGroupComponent', () => {
  let component: MeeToggleGroup<any>;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(MeeToggleGroup);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    view.host.multiple.set(true);
    view.detectChanges();
    view.$('button').click();
    expect(component.value()).toEqual(['1']);
  });
});
