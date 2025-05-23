import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autofocus } from '@ngbase/adk/a11y';
import { markControlsTouched } from '@ngbase/adk/form-field';
import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
import { Button } from '@meeui/ui/button';
import { DatepickerTrigger } from '@meeui/ui/datepicker';
import { FormField, MeeInput, InputError, Label } from '@meeui/ui/form-field';
import { Option, Select } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';
import { Checkbox } from '@meeui/ui/checkbox';

@Component({
  selector: 'app-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Heading,
    MeeInput,
    Label,
    FormField,
    InputError,
    Select,
    Option,
    Autocomplete,
    AutocompleteInput,
    DatepickerTrigger,
    Autofocus,
    Button,
    Checkbox,
  ],
  template: `
    <h4 meeHeader class="mb-5">Forms</h4>
    <form [formGroup]="forms" class="flex w-96 flex-col gap-2">
      <mee-form-field>
        <label meeLabel>Name</label>
        <input meeInput class="w-full" ngbAutofocus formControlName="name" placeholder="Name" />
        <p meeError="required">Name is required</p>
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Email</label>
        <input
          meeInput
          class="w-full"
          formControlName="email"
          autocomplete="off"
          placeholder="Email"
        />
        <p meeError="required">Email is required</p>
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Password</label>
        <input
          meeInput
          class="w-full"
          type="password"
          formControlName="password"
          autocomplete="off"
          placeholder="Password"
        />
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Country</label>
        <mee-select formControlName="country" placeholder="Country" class="w-full">
          <mee-option value="India">India</mee-option>
          <mee-option value="USA">USA</mee-option>
          <mee-option value="UK">UK</mee-option>
        </mee-select>
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Date</label>
        <input
          class="w-full"
          formControlName="date"
          placeholder="Date"
          meeDatepickerTrigger
          readonly
        />
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Users</label>
        <mee-autocomplete
          formControlName="users"
          placeholder="Users"
          [multiple]="true"
          class="w-full"
        >
          <input meeAutocompleteInput placeholder="Search users" />
          <mee-option value="User 1">User 1</mee-option>
          <mee-option value="User 2">User 2</mee-option>
          <mee-option value="User 3">User 3</mee-option>
        </mee-autocomplete>
      </mee-form-field>
      <mee-checkbox formControlName="terms"> I agree to the terms and conditions </mee-checkbox>
      <button meeButton type="submit" (click)="submit()">Submit</button>
    </form>
  `,
})
export default class FormsComponent {
  fb = inject(FormBuilder);

  forms = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    country: [''],
    date: [''],
    users: [''],
    terms: [false],
  });

  submit() {
    if (this.forms.invalid) {
      markControlsTouched(this.forms);
    }
  }
}
