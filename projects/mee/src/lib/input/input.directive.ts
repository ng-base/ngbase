import { Directive, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputStyle } from './input-style.directive';

@Directive({
  selector: '[meeInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
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
export class Input implements ControlValueAccessor {
  readonly value = signal<any>('');
  onChange = (value: string) => {};
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
