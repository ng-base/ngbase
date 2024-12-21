import { Directive } from '@angular/core';
import { MeeDatepickerTrigger, registerDatePicker } from '@meeui/adk/datepicker';
import { InputStyle } from '@meeui/ui/input';
import { DatePicker } from './datepicker';

@Directive({
  selector: '[meeDatepickerTrigger]',
  providers: [registerDatePicker(DatePicker)],
  hostDirectives: [
    InputStyle,
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
