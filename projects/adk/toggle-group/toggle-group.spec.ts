import { Component, signal } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbToggleGroup } from './toggle-group';
import { NgbToggleItem } from './toggle-item';

@Component({
  imports: [NgbToggleGroup, NgbToggleItem],
  template: `<div ngbToggleGroup [multiple]="multiple()">
    <button ngbToggleItem value="1">Item 1</button>
    <button ngbToggleItem value="2">Item 2</button>
  </div>`,
})
class TestComponent {
  readonly multiple = signal(false);
}

describe('ToggleGroupComponent', () => {
  let component: NgbToggleGroup<any>;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(NgbToggleGroup);
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
