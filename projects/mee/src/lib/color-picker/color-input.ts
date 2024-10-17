import { ChangeDetectionStrategy, Component, forwardRef, input, model } from '@angular/core';
import { ColorPickerTrigger } from './color-picker-trigger';
import { InputStyle } from '../input';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorFormat } from './color-picker';

@Component({
  standalone: true,
  selector: 'mee-color-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorPickerTrigger, FormsModule],
  template: `
    <input
      type="text"
      [ngModel]="value()"
      (ngModelChange)="updateValue($event)"
      class="w-full flex-1 bg-transparent outline-none"
    />
    <button
      #color
      type="button"
      meeColorPickerTrigger
      [value]="value()"
      [format]="format()"
      [presetColors]="presetColors()"
      (valueChange)="updateValue($event)"
      class="h-b5 w-b5 flex-none rounded-full border"
      [style.backgroundColor]="value()"
    ></button>
  `,
  hostDirectives: [InputStyle],
  host: {
    class: '!inline-flex gap-2 items-center',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorInput),
      multi: true,
    },
  ],
})
export class ColorInput implements ControlValueAccessor {
  // value = signal('#0E16D7');
  // value = signal('hsb(215, 91%, 100%)');
  format = input<ColorFormat>('hex');
  presetColors = input<string[]>();
  value = model<string>('');

  onChange = (value: string) => {};
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
