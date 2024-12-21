import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { DatepickerTrigger, TimePicker } from '@meeui/ui/datepicker';
import { FormField, Label } from '@meeui/ui/input';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-datepicker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Button,
    DatepickerTrigger,
    TimePicker,
    DocCode,
    Label,
    FormField,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="datepickerPage">Datepicker</h4>
    <div class="grid gap-b4">
      <div meeFormField>
        <label meeLabel>Time 24 -- {{ time24() }}</label>
        <mee-time [(value)]="time24" [is24]="true" />
      </div>
      <div meeFormField>
        <label meeLabel>Time -- {{ time() }}</label>
        <mee-time [(ngModel)]="time" />
      </div>
      <button meeButton (click)="toggle()">Toggle datepicker</button>
      <app-doc-code [tsCode]="tsCode">
        @if (show()) {
          <div class="flex w-52 flex-col">
            <div meeFormField class="w-full">
              <label meeLabel for="date" class="mb-1">Datetime</label>
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
          </div>
        }
        <div meeFormField class="w-full">
          <label meeLabel class="flex w-52 flex-col"> Date 2 calendars</label>
          <input
            [(ngModel)]="dateRange"
            placeholder="Date"
            meeDatepickerTrigger
            [noOfCalendars]="2"
            format="dd/MM/yyyy"
            [range]="true"
            readonly
          />
        </div>
        <div meeFormField class="w-full">
          <label meeLabel class="flex w-52 flex-col"> Date </label>
          <input
            [formControl]="date"
            placeholder="Date"
            meeDatepickerTrigger
            format="dd-MM-yyyy"
            readonly
          />
        </div>
        <div meeFormField class="w-full">
          <label meeLabel class="mt-4 flex w-52 flex-col"> Month picker</label>
          <input
            [formControl]="date"
            placeholder="Month"
            meeDatepickerTrigger
            [pickerType]="'month'"
            format="MM-yyyy"
            readonly
          />
        </div>
        <div meeFormField class="w-full">
          <label meeLabel class="mt-4 flex w-52 flex-col"> Year picker</label>
          <input
            [formControl]="date"
            placeholder="Year"
            meeDatepickerTrigger
            [pickerType]="'year'"
            format="yyyy"
            readonly
          />
        </div>
      </app-doc-code>
    </div>
  `,
})
export default class DatepickerComponent {
  date = new FormControl();
  rangeDate: Date[] = [];
  time24 = signal('');
  time = signal('10:12:02 AM');
  show = signal(true);
  dateRange = signal(['2024-10-01T00:00:00.000Z', '2024-10-31T23:59:59.999Z']);

  tsCode = `
  import { Component, signal } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { DatepickerTrigger } from '@meeui/ui/datepicker';
  import { Input } from '@meeui/ui/input';

  @Component({
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
  export class AppComponent {
    readonly date = signal('');
  }
  `;

  toggle() {
    this.show.update(v => !v);
  }
}
