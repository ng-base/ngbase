import { Component } from '@angular/core';
import { InputError } from './error';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, RenderResult } from '@meeui/ui/test';
import { FormField } from './form-field';
import { Input } from './input';

@Component({
  standalone: true,
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

  it('should be invalid when the control is invalid and the error is present', () => {
    expect(view.host.control.invalid).toBe(true);
    expect(view.host.control.errors).toEqual({
      required: true,
    });
    expect(view.host.control.touched).toBe(false);
    expect(view.$('p#required').hidden).toBe(true);
    expect(view.$('p#minlength').hidden).toBe(true);
  });

  it('should be invalid when the control is invalid and the error is present', () => {
    view.host.control.setValue('ab');
    view.detectChanges();
    expect(view.$('p#required').hidden).toBe(true);
    expect(view.$('p#minlength').hidden).toBe(false);

    view.host.control.setValue('abc');
    view.detectChanges();
    expect(view.$('p#required').hidden).toBe(true);
    expect(view.$('p#minlength').hidden).toBe(true);

    view.host.control.setValue('');
    view.detectChanges();
    expect(view.$('p#required').hidden).toBe(false);
    expect(view.$('p#minlength').hidden).toBe(true);
  });
});
