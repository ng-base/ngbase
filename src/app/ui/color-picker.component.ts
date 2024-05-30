import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { ColorPicker, ColorPickerTrigger } from '@meeui/color-picker';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-color-picker',
  imports: [FormsModule, Heading, Button, ColorPicker, ColorPickerTrigger],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Color picker</h4>
    <mee-color-picker></mee-color-picker>
    <button meeButton meeColorPickerTrigger class="mt-5">
      Open color picker
    </button>
  `,
})
export class ColorPickerComponent {}
