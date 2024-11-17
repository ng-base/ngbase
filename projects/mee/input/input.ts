import { Directive, inject, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, uniqueId } from '@meeui/ui/utils';
import { FormField } from './form-field';
import { InputStyle } from './input-style.directive';

@Directive({
  selector: '[meeInput]',
  providers: [provideValueAccessor(Input)],
  host: {
    class: 'focus:outline-none',
    role: 'textbox',
    '[attr.id]': 'id',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-placeholder]': 'ariaPlaceholder',
    '[value]': 'value()',
    '(input)': 'setValue($event.target.value, true)',
    '[class.border-red-500]': 'formField?.hasErrors()',
  },
  hostDirectives: [InputStyle],
})
export class Input<T = unknown> implements ControlValueAccessor {
  readonly formField = inject(FormField, { optional: true });
  readonly id = this.formField?.id ?? uniqueId();
  readonly value = model<T>('' as any);
  onChange?: (_: string) => void;
  onTouched?: () => void;

  setValue(value: any, fromInput = false): void {
    // console.log('setValue', value, fromInput);
    this.value.set(value);
    this.onChange?.(value);
    this.onTouched?.();
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
