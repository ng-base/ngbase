import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { DatePicker } from '@meeui/datepicker';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [Heading, DatePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="calendarPagePage">Calendar</h4>
    <mee-date-picker class="w-full"></mee-date-picker>
  `,
})
export class CalendarComponent {}
