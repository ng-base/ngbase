import { render, RenderResult } from '@ngbase/adk/test';
import { NgbList } from './list';
import { Component } from '@angular/core';

@Component({
  template: `<li ngbList></li>`,
  imports: [NgbList],
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
