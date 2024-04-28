import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../projects/mee/src/lib/datepicker';

@Component({
  standalone: true,
  imports: [DatePickerComponent],
  selector: 'mme-ui-test',
  template: ` <mee-date-picker></mee-date-picker> `,
})
export class UiTestComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
