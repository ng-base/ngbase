import { Component } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import {
  FormField,
  Input,
  Label,
  InputError,
  Description,
  InputPrefix,
  InputSuffix,
} from '@meeui/ui/form-field';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    Input,
    FormField,
    Label,
    InputError,
    Description,
    InputPrefix,
    InputSuffix,
  ],
  template: `
    <mee-form-field>
      <label meeLabel>Input</label>
      <input meeInput [(ngModel)]="inputValue" placeholder="Input" />
    </mee-form-field>

    <mee-form-field>
      <label meeLabel>Input</label>
      <p meeDescription>This is a description</p>
      <div name="lucideEye" meePrefix class="text-muted-foreground">P</div>
      <input meeInput [(ngModel)]="inputValue" placeholder="Input" />
      <div name="lucideEyeOff" meeSuffix class="text-muted-foreground">S</div>
      <p meeError="required">This field is required</p>
      <p meeError="!required && minlength">This field must be at least 3 characters long</p>
    </mee-form-field>

    <mee-form-field>
      <label meeLabel>Textarea</label>
      <textarea meeInput></textarea>
    </mee-form-field>
  `,
})
export class AppComponent {
  readonly inputValue = new FormControl('', [Validators.required, Validators.minLength(3)]);
}
