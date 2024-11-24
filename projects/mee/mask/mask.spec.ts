import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { MaskInput } from './mask';

@Component({
  imports: [MaskInput, FormsModule],
  template: `<input [meeMask]="mask" [(ngModel)]="value" />`,
})
class TestComponent {
  mask = '';
  value = '';
}

describe('MaskInput', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
