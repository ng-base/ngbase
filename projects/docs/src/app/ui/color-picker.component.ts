import { Component, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { ColorInput } from '@meeui/color-picker';
import { Label } from '@meeui/input';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-color-picker',
  imports: [FormsModule, Heading, ColorInput, Label, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Color picker</h4>
    <!-- <button meeButton meeColorPickerTrigger class="mt-5">Open color picker</button>
    color -- {{ hexColor() }} -->

    <app-doc-code [tsCode]="tsCode">
      <label meeLabel>
        Hex color
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
      </label>

      <label meeLabel>
        RGB color
        <mee-color-input [format]="'rgb'" [(value)]="rgbColor" />
      </label>
    </app-doc-code>
  `,
})
export class ColorPickerComponent {
  hexColor = signal('#1778FF');
  rgbColor = signal('rgb(255, 0, 0)');
  hsbColor = signal('hsb(215, 91%, 100%)');

  tsCode = `
  import { Component } from '@angular/core';
  import { ColorInput } from '@meeui/color-picker';
  import { Label } from '@meeui/input';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`
      <label meeLabel>
        Hex color
        <mee-color-input
          [(ngModel)]="hexColor"
          [presetColors]="['#ffffff', '#2889e9']"
         />
      </label>
    \`,
    imports: [ColorInput, Label],
  })
  export class AppComponent {
    hexColor = '#1778FF';
  }
  `;
}
