import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputError, FormField, Input, Label, Description, InputPrefix } from '@meeui/ui/input';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';

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
  ],
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff })],
  template: `
    <h4 meeHeader class="mb-5" id="inputPage">Input</h4>
    <app-doc-code [tsCode]="tsCode">
      <div class="flex flex-col gap-b4">
        <mee-form-field>
          <label meeLabel>Input</label>
          <p meeDescription>This is a description</p>
          <!-- <mee-icon name="lucideEyeOff" /> -->
          <input meeInput [formControl]="inputValue" placeholder="Input" class="w-full" />
          <mee-icon name="lucideEye" meeInputPrefix />
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
export class InputComponent {
  inputValue = new FormControl('', [Validators.required, Validators.minLength(3)]);

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Input } from '@meeui/ui/input';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [FormsModule, Input],
    template: \`
      <input meeInput [(ngModel)]="inputValue" placeholder="Input" />
      
      <textarea meeInput></textarea>
    \`,
  })
  export class AppComponent {
    inputValue = '';
  }
  `;
}
