import { Component } from '@angular/core';
import { NgbInlineEdit, NgbInlineInput, NgbInlineValue, provideInlineEdit } from './inline-edit';
import { render, RenderResult } from '@ngbase/adk/test';

@Component({
  providers: [provideInlineEdit(), { provide: NgbInlineEdit, useExisting: TestComponent }],
  imports: [NgbInlineInput, NgbInlineValue],
  template: `<div ngbInlineEdit>
    @if (isEditing()) {
      <input ngbInlineInput />
    } @else {
      <div id="value" ngbInlineValue>Hello</div>
    }
  </div>`,
})
class TestComponent extends NgbInlineEdit {}

describe('NgbInlineEdit', () => {
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
