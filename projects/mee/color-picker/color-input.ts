import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerTrigger, MeeColorInput, provideColorPicker } from '@meeui/adk/color-picker';
import { provideValueAccessor } from '@meeui/adk/utils';
import { InputStyle } from '@meeui/ui/input';
import { ColorPicker } from './color-picker';

@Component({
  selector: 'mee-color-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideColorPicker(ColorPicker), provideValueAccessor(ColorInput)],
  hostDirectives: [InputStyle],
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
  host: {
    class: '!inline-flex gap-2 items-center',
  },
})
export class ColorInput extends MeeColorInput {}
