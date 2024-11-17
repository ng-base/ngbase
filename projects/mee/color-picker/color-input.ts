import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { InputStyle } from '@meeui/ui/input';
import { provideValueAccessor } from '@meeui/ui/utils';
import { ColorFormat } from './color-picker';
import { ColorPickerTrigger } from './color-picker-trigger';

@Component({
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
  providers: [provideValueAccessor(ColorInput)],
})
export class ColorInput implements ControlValueAccessor {
  // value = signal('#0E16D7');
  // value = signal('hsb(215, 91%, 100%)');
  format = input<ColorFormat>('hex');
  presetColors = input<string[]>();
  value = model<string>('');

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
