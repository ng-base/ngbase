import { Component } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { MeeInput } from './form-field';

@Component({
  imports: [MeeInput],
  template: ` <input meeInput /> `,
})
class TestInput {}

describe('InputComponent', () => {
  let component: TestInput;
  let view: RenderResult<TestInput>;
  let input: MeeInput;

  beforeEach(async () => {
    view = await render(TestInput);
    component = view.host;
    input = view.viewChild(MeeInput);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(input).toBeTruthy();
  });
});
