import { Component } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { Input } from './input';

@Component({
  imports: [Input],
  template: ` <input meeInput /> `,
})
class TestInput {}

describe('InputComponent', () => {
  let component: TestInput;
  let view: RenderResult<TestInput>;
  let input: Input;

  beforeEach(async () => {
    view = await render(TestInput);
    component = view.host;
    input = view.viewChild(Input);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(input).toBeTruthy();
  });
});
