import { Component } from '@angular/core';
import { MeeInlineEdit, MeeInlineInput, MeeInlineValue, provideInlineEdit } from './inline-edit';
import { render, RenderResult } from '@meeui/adk/test';

@Component({
  providers: [provideInlineEdit(), { provide: MeeInlineEdit, useExisting: TestComponent }],
  imports: [MeeInlineInput, MeeInlineValue],
  template: `<div meeInlineEdit>
    @if (isEditing()) {
      <input meeInlineInput />
    } @else {
      <div id="value" meeInlineValue>Hello</div>
    }
  </div>`,
})
class TestComponent extends MeeInlineEdit {}

describe('MeeInlineEdit', () => {
  let view: RenderResult<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should render only the value when not editing', () => {
    expect(view.$('div')?.textContent).toBe('Hello');
    expect(view.$('input')).toBeNull();
  });

  it('should render only the input when editing', () => {
    component.isEditing.set(true);
    view.detectChanges();
    expect(view.$('input')).not.toBeNull();
    expect(view.$('#value')).toBeNull();
  });
});
