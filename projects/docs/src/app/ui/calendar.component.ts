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
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <mee-date-picker
        [noOfCalendar]="1"
        [range]="true"
        class="rounded-base border bg-foreground shadow-sm"
      ></mee-date-picker>
    </app-doc-code>
  `,
})
export class CalendarComponent {
  htmlCode = `
      <mee-date-picker></mee-date-picker>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { DatePicker } from '@meeui/datepicker';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`${this.htmlCode}\`,
    imports: [DatePicker],
  })
  export class AppComponent { }
  `;
}
