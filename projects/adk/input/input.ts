import { Directive, inject, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, uniqueId } from '@meeui/adk/utils';
import { MeeFormField } from './form-field';

@Directive({
  selector: '[meeInput]',
  providers: [provideValueAccessor(InputBase)],
  host: {
    role: 'textbox',
    '[attr.id]': 'id',
    '[value]': 'value()',
    '(input)': 'setValue($event.target.value, true)',
  },
})
export class InputBase<T = unknown> implements ControlValueAccessor {
  readonly formField = inject(MeeFormField, { optional: true });
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
