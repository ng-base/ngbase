import { Directive, ElementRef, inject } from '@angular/core';
import { popoverPortal } from '../popover';
import { DatePickerComponent } from './datepicker.component';

@Directive({
  standalone: true,
  selector: '[meeDatepickerTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class DatepickerTrigger {
  constructor() {}

  el = inject(ElementRef);
  popover = popoverPortal();
  close: () => void = () => {};

  open() {
    const { diaRef } = this.popover.open(
      DatePickerComponent,
      { target: this.el.nativeElement, position: 'bl' },
      { maxHeight: '400px' },
    );
    this.close = diaRef.close;
  }
}
