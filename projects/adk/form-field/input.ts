import { Directive, inject, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor, uniqueId } from '@ngbase/adk/utils';
import { NgbFormField } from './form-field';

@Directive({
  selector: '[ngbInputBase]',
  providers: [provideValueAccessor(InputBase)],
  host: {
    role: 'textbox',
    '[attr.id]': 'id',
    '[value]': 'value()',
    '(input)': 'setValue($event.target.value, true)',
  },
})
export class InputBase<T = unknown> implements ControlValueAccessor {
  readonly formField = inject(NgbFormField, { optional: true });
  readonly value = model<T>('' as any);

  readonly id = this.formField?._id ?? uniqueId();

  onChange?: (_: string) => void;
  onTouched?: () => void;

  setValue(value: any, fromInput = false): void {
    this.value.set(value);
    if (fromInput) {
      this.onChange?.(value);
      this.onTouched?.();
    }
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
