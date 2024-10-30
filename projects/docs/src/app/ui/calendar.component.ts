import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { DatePicker } from '@meeui/datepicker';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [Heading, DatePicker, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="calendarPagePage">Calendar</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-date-picker
        [noOfCalendar]="1"
        [range]="true"
        class="rounded-base border bg-foreground shadow-sm"
      />
    </app-doc-code>
  `,
})
export class CalendarComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { DatePicker } from '@meeui/datepicker';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`<mee-date-picker />\`,
    imports: [DatePicker],
  })
  export class AppComponent { }
  `;
}
