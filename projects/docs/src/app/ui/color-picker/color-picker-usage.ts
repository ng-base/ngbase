import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorInput } from '@meeui/ui/color-picker';
import { Label, FormField } from '@meeui/ui/form-field';

@Component({
  selector: 'app-root',
  imports: [ColorInput, Label, FormField, FormsModule],
  template: `
    <mee-form-field>
      <label meeLabel>Hex color</label>
      <mee-color-input [(ngModel)]="hexColor" [presetColors]="['#ffffff', '#2889e9']" />
    </mee-form-field>
  `,
})
export class AppComponent {
  hexColor = '#1778FF';
}
