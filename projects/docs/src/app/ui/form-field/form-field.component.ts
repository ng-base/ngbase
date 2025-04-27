import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Description,
  FormField,
  Input,
  InputError,
  InputPrefix,
  InputSuffix,
  Label,
} from '@meeui/ui/form-field';
import { Icon } from '@meeui/ui/icon';
import { Heading } from '@meeui/ui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-input',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Input,
    InputError,
    FormField,
    Label,
    Description,
    DocCode,
    Icon,
    InputPrefix,
    InputSuffix,
  ],
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
  template: `
    <h4 meeHeader class="mb-5" id="inputPage">Input</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCommand]="adkCommand">
      <div class="flex flex-col gap-4">
        <mee-form-field>
          <label meeLabel>Input</label>
          <p meeDescription>This is a description</p>
          <mee-icon name="lucideEye" meePrefix class="text-muted-foreground" />
          <input meeInput [formControl]="inputValue" placeholder="Input" class="w-full" />
          <mee-icon name="lucideEyeOff" meeSuffix class="text-muted-foreground" />
          <p meeError="required">This field is required</p>
          <p meeError="!required && minlength">This field must be at least 3 characters long</p>
        </mee-form-field>

        <div meeFormField>
          <label meeLabel>Textarea</label>
          <textarea type="text" meeInput id="textarea" class="w-full"></textarea>
        </div>
      </div>
    </app-doc-code>
  `,
})
export default class InputComponent {
  inputValue = new FormControl('', [Validators.required, Validators.minLength(3)]);

  tsCode = getCode('form-field/form-field-usage.ts');
  adkCommand = `pnpm ng g @ngbase/adk:ui`;
}
