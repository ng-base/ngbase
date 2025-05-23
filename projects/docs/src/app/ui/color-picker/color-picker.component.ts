import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorInput } from '@meeui/ui/color-picker';
import { FormField, Label } from '@meeui/ui/form-field';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-color-picker',
  imports: [FormsModule, Heading, ColorInput, FormField, Label, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Color picker</h4>
    <!-- <button meeButton meeColorPickerTrigger class="mt-5">Open color picker</button>
    color -- {{ hexColor() }} -->

    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <div class="flex flex-col gap-4 md:flex-row">
        <mee-form-field>
          <label meeLabel>Hex color</label>
          <mee-color-input
            [(ngModel)]="hexColor"
            [presetColors]="[
              '#000000',
              '#93c5fd',
              '#86efac',
              '#fde68a',
              '#fca5a5',
              '#c4b5fd',
              '#fbcfe8',
              '#5eead4',
              '#fdba74',
              '#a5b4fc',
              '#d6b4a7',
              '#cbd5e1',
            ]"
          />
        </mee-form-field>
        <mee-form-field>
          <label meeLabel>RGB color</label>
          <mee-color-input [format]="'rgb'" [(value)]="rgbColor" />
        </mee-form-field>
      </div>
    </app-doc-code>
  `,
})
export default class ColorPickerComponent {
  hexColor = signal('#1778FF');
  rgbColor = signal('rgb(255, 0, 0)');
  hsbColor = signal('hsb(215, 91%, 100%)');

  tsCode = getCode('/color-picker/color-picker-usage.ts');

  adkCode = getCode('/color-picker/color-picker-adk.ts');
}
