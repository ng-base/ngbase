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
  el = inject(ElementRef);
  datepicker = input<DatePicker>();
  noOfCalendars = input(1, { transform: (v: number) => Math.max(1, v) });
  range = input(false);
  format = input<string>('MM-dd-yyyy');
  inputS = inject(Input);
  pickerType = input<'date' | 'month' | 'year'>('date');

  popover = popoverPortal();
  close?: VoidFunction;

  constructor() {}

  open() {
    const { diaRef } = this.popover.open(
      DatePicker,
      { target: this.el.nativeElement, position: 'bl' },
      {
        maxHeight: '400px',
        data: {
          pickerType: this.pickerType(),
          noOfCalendars: this.noOfCalendars(),
          range: this.range(),
          format: this.format(),
          target: this.el.nativeElement,
        },
      },
    );
    this.close = diaRef.close;
  }
}
