import { Directive } from '@angular/core';
import { MeeDatepickerTrigger, registerDatePicker } from '@meeui/adk/datepicker';
import { DatePicker } from './datepicker';

@Directive({
  selector: '[meeDatepickerTrigger]',
  providers: [registerDatePicker(DatePicker)],
  hostDirectives: [
    {
      directive: MeeDatepickerTrigger,
      inputs: [
        'noOfCalendars',
        'range',
        'time',
        'format',
        'fieldFormat',
        'dateFilter',
        'pickerType',
        'pickerTemplate',
      ],
    },
  ],
  host: {
    class: 'cursor-pointer hover:bg-muted-background',
  },
})
export class DatepickerTrigger<D> {}
