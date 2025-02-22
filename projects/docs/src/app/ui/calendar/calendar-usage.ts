import { Component } from '@angular/core';
import { DatePicker } from '@meeui/ui/datepicker';

@Component({
  selector: 'app-root',
  imports: [DatePicker],
  template: `<mee-date-picker />`,
})
export class AppComponent {}
