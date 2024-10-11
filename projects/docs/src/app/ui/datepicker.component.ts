import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { DatepickerTrigger, TimePicker } from '@meeui/datepicker';
import { Button } from '@meeui/button';
import { Input, Label } from '@meeui/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocCode } from './code.component';

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
    DocCode,
    Label,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="datepickerPage">Datepicker</h4>
    <div class="grid gap-b4">
      <label meeLabel class="flex w-52 flex-col">
        Time 24 -- {{ time24() }}
        <mee-time [(value)]="time24" [is24]="true"></mee-time>
      </label>
      <label meeLabel class="flex w-52 flex-col">
        Time -- {{ time() }}
        <mee-time [(ngModel)]="time"></mee-time>
      </label>
      <button meeButton (click)="toggle()">Toggle datepicker</button>
      <app-doc-code [tsCode]="tsCode">
        @if (show()) {
          <div class="flex w-52 flex-col">
            <label for="date" class="mb-1">Datetime</label>
            <input
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
        <label meeLable class="flex w-52 flex-col">
          Date 2 calendars
          <input
            [(ngModel)]="dateRange"
            placeholder="Date"
            meeDatepickerTrigger
            [noOfCalendars]="2"
            format="dd/MM/yyyy"
            [range]="true"
            readonly
          />
        </label>
        <label meeLabel class="flex w-52 flex-col">
          Date
          <input
            [formControl]="date"
            placeholder="Date"
            meeDatepickerTrigger
            format="dd-MM-yyyy"
            readonly
          />
        </label>
        <label meeLabel class="mt-4 flex w-52 flex-col">
          Month picker
          <input
            [formControl]="date"
            placeholder="Month"
            meeDatepickerTrigger
            [pickerType]="'month'"
            format="MM-yyyy"
            readonly
          />
        </label>
        <label class="mt-4 flex w-52 flex-col">
          Year picker
          <input
            [formControl]="date"
            placeholder="Year"
            meeDatepickerTrigger
            [pickerType]="'year'"
            format="yyyy"
            readonly
          />
        </label>
      </app-doc-code>
    </div>
  `,
})
export class DatepickerComponent {
  date = new FormControl();
  rangeDate: Date[] = [];
  time24 = signal('');
  time = signal('10:12:02 AM');
  show = signal(true);
  dateRange = signal(['2024-10-01T00:00:00.000Z', '2024-10-31T23:59:59.999Z']);

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { DatepickerTrigger } from '@meeui/datepicker';
  import { Input } from '@meeui/input';
  import { signal } from '@meeui/utils';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [DatepickerTrigger, FormsModule, Input],
    template: \`
      <input
        meeInput
        [(ngModel)]="date"
        placeholder="Date"
        meeDatepickerTrigger
        format="dd-MM-yyyy"
        readonly
      />
    \`
  })
  export class AppComponent {}
  `;

  toggle() {
    this.show.update(v => !v);
  }
}
