import { Directive, input, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@ngbase/adk/utils';
import { ColorFormat } from './color-picker';

@Directive({
  selector: '[ngbColorInput]',
  providers: [provideValueAccessor(NgbColorInput)],
})
export class NgbColorInput implements ControlValueAccessor {
  readonly format = input<ColorFormat>('hex');
  readonly presetColors = input<string[]>();
  readonly value = model<string>('');

  onChange = (_: string) => {};
  onTouched = () => {};

  updateValue(value = ''): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
