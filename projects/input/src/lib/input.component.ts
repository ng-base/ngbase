import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '[meeInput]',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
  host: {
    class: 'block w-full px-3 py-2 border border-gray-300 rounded-md',
    role: 'textbox',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-placeholder]': 'ariaPlaceholder',
    '[value]': 'value',
    '(input)': 'setValue($event.target.value)',
  },
})
export class Input implements ControlValueAccessor {
  value = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  setValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
