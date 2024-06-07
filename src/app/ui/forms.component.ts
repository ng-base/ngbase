import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Autocomplete, AutocompleteInput } from '@meeui/autocomplete';
import { Button } from '@meeui/button';
import { Card } from '@meeui/card';
import { DatePicker, DatepickerTrigger } from '@meeui/datepicker';
import { Input } from '@meeui/input';
import { Select, Option } from '@meeui/select';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Heading,
    Card,
    Button,
    Input,
    Select,
    Option,
    Autocomplete,
    AutocompleteInput,
    DatePicker,
    DatepickerTrigger,
  ],
  template: `
    <h4 meeHeader class="mb-5 ">Forms</h4>
    <form [formGroup]="forms" class="flex w-96 flex-col gap-b2">
      <div class="flex flex-col">
        <label for="name" class="mb-1">Name</label>
        <input meeInput formControlName="name" id="name" placeholder="Name" />
      </div>
      <div class="flex flex-col">
        <label for="email" class="mb-1">Email</label>
        <input
          meeInput
          formControlName="email"
          autocomplete="off"
          id="email"
          placeholder="Email"
        />
      </div>
      <div class="flex flex-col">
        <label for="password" class="mb-1">Password</label>
        <input
          meeInput
          type="password"
          formControlName="password"
          autocomplete="off"
          id="password"
          placeholder="Password"
        />
      </div>
      <div class="flex flex-col">
        <label for="country" class="mb-1">Country</label>
        <mee-select
          formControlName="country"
          id="country"
          placeholder="Country"
        >
          <mee-option value="India">India</mee-option>
          <mee-option value="USA">USA</mee-option>
          <mee-option value="UK">UK</mee-option>
        </mee-select>
      </div>
      <div class="flex flex-col">
        <label for="date" class="mb-1">Date</label>
        <input
          meeInput
          formControlName="date"
          id="date"
          placeholder="Date"
          meeDatepickerTrigger
          readonly
        />
      </div>
      <div class="flex flex-col">
        <label for="users" class="mb-1">Users</label>
        <mee-autocomplete
          formControlName="users"
          id="users"
          placeholder="Users"
          [multiple]="true"
        >
          <input meeAutocompleteInput placeholder="Search users" />
          <mee-option value="User 1">User 1</mee-option>
          <mee-option value="User 2">User 2</mee-option>
          <mee-option value="User 3">User 3</mee-option>
        </mee-autocomplete>
      </div>
    </form>
  `,
})
export class FormsComponent {
  fb = inject(FormBuilder);

  forms = this.fb.group({
    name: [''],
    email: [''],
    password: [''],
    country: [''],
    date: [''],
    users: [''],
  });
}
