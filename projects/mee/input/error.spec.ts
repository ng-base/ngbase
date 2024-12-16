import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { FormField, Input, InputError } from './input';

@Component({
  selector: 'test-component',
  imports: [FormField, InputError, ReactiveFormsModule, Input],
  template: ` <div meeFormField>
    <input meeInput [formControl]="control" />
    <p id="required" meeError="required">Error</p>
    <p id="minlength" meeError="!required && minlength">Error</p>
  </div>`,
})
class TestComponent {
  readonly control = new FormControl('', [Validators.required, Validators.minLength(3)]);
}

describe('Input Error', () => {
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    view.detectChanges();
  });

  function isRequired() {
    return view.$('p#required').hidden === false;
  }

  function isMinlength() {
    return view.$('p#minlength').hidden === false;
  }

  it('should be invalid when the control is invalid and the error is present', () => {
    expect(view.host.control.invalid).toBe(true);
    expect(view.host.control.errors).toEqual({
      required: true,
    });
    expect(view.host.control.touched).toBe(false);
    expect(isRequired()).toBe(false);
    expect(isMinlength()).toBe(false);
  });

  it('should be invalid when the control is invalid and the error is present', () => {
    view.host.control.setValue('ab');
    view.detectChanges();
    expect(isRequired()).toBe(false);
    expect(isMinlength()).toBe(true);

    view.host.control.setValue('abc');
    view.detectChanges();
    expect(isRequired()).toBe(false);
    expect(isMinlength()).toBe(false);

    view.host.control.setValue('');
    view.detectChanges();
    expect(isRequired()).toBe(true);
    expect(isMinlength()).toBe(false);
  });
});
