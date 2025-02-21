import { Directive } from '@angular/core';
import { NgbDatepickerTrigger, registerDatePicker } from '@ngbase/adk/datepicker';
import { DatePicker } from './datepicker';

@Directive({
  selector: '[meeDatepickerTrigger]',
  providers: [registerDatePicker(DatePicker)],
  hostDirectives: [
    {
      directive: NgbDatepickerTrigger,
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
