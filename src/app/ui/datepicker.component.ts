import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { DatepickerTrigger, TimePicker } from '@meeui/datepicker';
import { Button } from '@meeui/button';
import { Input } from '@meeui/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-datepicker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Button,
    DatepickerTrigger,
    Input,
    TimePicker,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="datepickerPage">Datepicker</h4>
    <div class="grid gap-b4">
      <div class="flex w-52 flex-col">
        <label for="time24" class="mb-1">Time 24 -- {{ time24() }}</label>
        <mee-time [(ngModel)]="time24" [is24]="true"></mee-time>
      </div>
      <div class="flex w-52 flex-col">
        <label for="time" class="mb-1">Time -- {{ time() }}</label>
        <mee-time [(ngModel)]="time"></mee-time>
      </div>
      <!-- <button meeButton meeDatepickerTrigger>Open datepicker</button> -->
      <button meeButton (click)="toggle()">Toggle datepicker</button>
      @if (show()) {
        <div class="flex w-52 flex-col">
          <label for="date" class="mb-1">Datetime</label>
          <input
            meeInput
            [formControl]="date"
            id="date"
            placeholder="Date"
            meeDatepickerTrigger
            format="dd-MM-yyyy hh:mm a"
            [range]="true"
            [time]="true"
            readonly
          />
        </div>
      }
      <div class="flex w-52 flex-col">
        <label for="date" class="mb-1">Date 2 cals</label>
        <input
          meeInput
          [formControl]="date"
          id="date"
          placeholder="Date"
          meeDatepickerTrigger
          [noOfCalendars]="2"
          format="dd/MM/yyyy"
          [range]="true"
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
          format="dd-MM-yyyy"
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
          format="MM-yyyy"
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
          format="yyyy"
          readonly
        />
      </div>
    </div>
  `,
})
export class DatepickerComponent {
  date = new FormControl();
  time24 = signal('');
  time = signal('');
  show = signal(true);

  toggle() {
    this.show.update((v) => !v);
  }
}
