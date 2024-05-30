import { Directive, ElementRef, inject, input } from '@angular/core';
import { popoverPortal } from '../popover';
import { DatePicker } from './datepicker.component';
import { Input } from '../input';

@Directive({
  standalone: true,
  selector: '[meeDatepickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class DatepickerTrigger {
  datepicker = input<DatePicker>();
  noOfCalendars = input(1, { transform: (v: number) => Math.max(1, v) });
  range = input(false);
  inputS = inject(Input);
  pickerType = input<'date' | 'month' | 'year'>('date');

  constructor() {}

  el = inject(ElementRef);
  popover = popoverPortal();
  close: VoidFunction = () => {};

  open() {
    const { diaRef } = this.popover.open(
      DatePicker,
      { target: this.el.nativeElement, position: 'bottom' },
      {
        maxHeight: '400px',
        data: {
          pickerType: this.pickerType(),
          noOfCalendars: this.noOfCalendars(),
          range: this.range(),
        },
      },
    );
    this.close = diaRef.close;
  }
}
