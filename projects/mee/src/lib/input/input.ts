import { Directive, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { InputStyle } from './input-style.directive';
import { provideValueAccessor } from '@meeui/utils';

@Directive({
  standalone: true,
  selector: '[meeInput]',
  providers: [provideValueAccessor(Input)],
  host: {
    role: 'textbox',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-placeholder]': 'ariaPlaceholder',
    '[value]': 'value()',
    '(input)': 'setValue($event.target.value)',
    class: 'focus:outline-none',
  },
  hostDirectives: [InputStyle],
})
export class Input<T = unknown> implements ControlValueAccessor {
  readonly value = model<T>('' as any);
  onChange = (_: string) => {};
  onTouched = () => {};

  setValue(value: any): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }
}
