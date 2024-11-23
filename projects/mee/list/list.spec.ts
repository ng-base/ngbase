import { render, RenderResult } from '@meeui/adk/test';
import { List } from './list';
import { Component } from '@angular/core';

@Component({
  template: `<li meeList></li>`,
  imports: [List],
})
class TestComponent {}

describe('ListComponent', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
