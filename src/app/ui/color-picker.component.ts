import { Component, computed, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { ColorPicker, ColorInput, ColorPickerTrigger } from '@meeui/color-picker';
import { Button } from '@meeui/button';
import { Label } from '@meeui/input';

@Component({
  standalone: true,
  selector: 'app-color-picker',
  imports: [FormsModule, Heading, Button, ColorPicker, ColorPickerTrigger, ColorInput, Label],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Color picker</h4>
    <button meeButton meeColorPickerTrigger class="mt-5">Open color picker</button>
    color -- {{ hexColor() }}
    <label meeLabel>
      Hex color
      <mee-color-input
        [(ngModel)]="hexColor"
        [presetColors]="['#ffffff', '#2889e9']"
      ></mee-color-input>
    </label>
    <label meeLabel>
      RGB color
      <mee-color-input [format]="'rgb'" [(ngModel)]="rgbColor"></mee-color-input>
    </label>
  `,
})
export class ColorPickerComponent {
  hexColor = signal('#1778FF');
  rgbColor = signal('rgb(255, 0, 0');
  hsbColor = signal('hsb(215, 91%, 100%)');
}
