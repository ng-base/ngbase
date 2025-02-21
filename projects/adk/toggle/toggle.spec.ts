import { Component } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbToggle } from './toggle';

@Component({
  imports: [NgbToggle],
  template: `<button ngbToggle>Toggle</button>`,
})
class TestComponent {}

describe('ToggleComponent', () => {
  let component: NgbToggle;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(NgbToggle);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
