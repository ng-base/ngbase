import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { DatepickerTrigger, EndDate, TimePicker } from '@meeui/ui/datepicker';
import { FormField, InputSuffix, Label } from '@meeui/ui/form-field';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';
import { PopoverClose } from '@meeui/ui/popover';
import { Radio, RadioGroup } from '@meeui/ui/radio';

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
    InputSuffix,
    PopoverClose,
    Radio,
    RadioGroup,
    EndDate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="datepickerPage">Datepicker</h4>
    <div class="grid gap-4">
      <mee-form-field>
        <label meeLabel>Time 24 -- {{ time24() }}</label>
        <mee-time [(value)]="time24" [is24]="true" />
      </mee-form-field>
      <mee-form-field>
        <label meeLabel>Time -- {{ time() }}</label>
        <mee-time [(ngModel)]="time" />
      </mee-form-field>
      <button meeButton (click)="toggle()">Toggle datepicker</button>
      <app-doc-code [tsCode]="tsCode">
        @if (show()) {
          <div class="flex w-52 flex-col">
            <mee-form-field class="w-full">
              <!-- <label meeLabel for="date" class="mb-1">Datetime</label> -->
              <input
                [formControl]="date"
                id="date"
                placeholder="Date"
                meeDatepickerTrigger
                format="dd-MM-yyyy hh:mm a"
                range
                time
                readonly
              />
            </mee-form-field>
          </div>
          {{ date.value }}
        }
        <mee-form-field class="w-full">
          <label meeLabel class="flex w-52 flex-col"> Date 2 calendars</label>
          <input
            #dateRangeTrigger="meeDatepickerTrigger"
            [(ngModel)]="startDate"
            placeholder="Date"
            meeDatepickerTrigger
            noOfCalendars="2"
            format="dd/MM/yyyy"
            range
            readonly
          />
          <input [meeEndDate]="dateRangeTrigger" [(ngModel)]="endDate" />
          <button meeSuffix meeButton (click)="dateRange.set([])">clear</button>
        </mee-form-field>
        <mee-form-field class="w-full">
          <label meeLabel class="flex w-52 flex-col"> Date </label>
          <input
            [formControl]="dateSingle"
            placeholder="Date"
            meeDatepickerTrigger
            name="dateSingle"
            format="dd-MM-yyyy"
            [pickerTemplate]="pickerTemplate"
            readonly
          />
        </mee-form-field>
        <mee-form-field class="w-full">
          <label meeLabel class="mt-4 flex w-52 flex-col"> Month picker</label>
          <input
            [formControl]="date"
            placeholder="Month"
            meeDatepickerTrigger
            [pickerType]="'month'"
            format="MM-yyyy"
            readonly
          />
        </mee-form-field>
        <mee-form-field class="w-full">
          <label meeLabel class="mt-4 flex w-52 flex-col"> Year picker</label>
          <input
            [formControl]="date"
            placeholder="Year"
            meeDatepickerTrigger
            [pickerType]="'year'"
            format="yyyy"
            readonly
          />
        </mee-form-field>
      </app-doc-code>

      <ng-template #pickerTemplate>
        <mee-radio-group class="flex flex-col gap-2">
          <mee-radio meePopoverClose value="1">One</mee-radio>
          <mee-radio meePopoverClose value="2">Two</mee-radio>
          <mee-radio meePopoverClose value="3">Three</mee-radio>
          <mee-radio value="4">Four</mee-radio>
        </mee-radio-group>
      </ng-template>
    </div>
  `,
})
export default class DatepickerComponent {
  date = new FormControl();
  dateSingle = new FormControl();
  rangeDate: Date[] = [];
  time24 = signal('');
  time = signal('10:12:02 AM');
  show = signal(true);
  dateRange = signal<string[]>(['2024-10-01T00:00:00.000Z', '2024-10-31T23:59:59.999Z']);
  startDate = signal('');
  endDate = signal('');

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
