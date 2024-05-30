import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { DatepickerTrigger } from '@meeui/datepicker';
import { Button } from '@meeui/button';
import { Input } from '@meeui/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-datepicker',
  imports: [ReactiveFormsModule, Heading, Button, DatepickerTrigger, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="datepickerPage">Datepicker</h4>
    <!-- <button meeButton meeDatepickerTrigger>Open datepicker</button> -->
    <div class="flex w-52 flex-col">
      <label for="date" class="mb-1">Date</label>
      <input
        meeInput
        [formControl]="date"
        id="date"
        placeholder="Date"
        meeDatepickerTrigger
        [noOfCalendars]="2"
        readonly
      />
    </div>

    <div class="flex w-52 flex-col">
      <label for="date" class="mb-1">Date</label>
      <input
        meeInput
        [formControl]="date"
        id="date"
        placeholder="Date"
        meeDatepickerTrigger
        readonly
      />
    </div>

    <div class="mt-4 flex w-52 flex-col">
      <label for="month" class="mb-1">Month picker</label>
      <input
        meeInput
        [formControl]="date"
        id="month"
        placeholder="Month"
        meeDatepickerTrigger
        [pickerType]="'month'"
        readonly
      />
    </div>

    <div class="mt-4 flex w-52 flex-col">
      <label for="year" class="mb-1">Year picker</label>
      <input
        meeInput
        [formControl]="date"
        id="year"
        placeholder="Year"
        meeDatepickerTrigger
        [pickerType]="'year'"
        readonly
      />
    </div>
  `,
})
export class DatepickerComponent {
  date = new FormControl();
}
