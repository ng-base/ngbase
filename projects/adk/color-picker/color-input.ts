import { Directive, input, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@meeui/adk/utils';
import { ColorFormat } from './color-picker';

@Directive({
  selector: '[meeColorInput]',
  providers: [provideValueAccessor(MeeColorInput)],
})
export class MeeColorInput implements ControlValueAccessor {
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
