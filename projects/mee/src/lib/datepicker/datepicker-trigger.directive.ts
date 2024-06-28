import {
  Directive,
  ElementRef,
  TemplateRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { popoverPortal } from '../popover';
import { DatePicker } from './datepicker.component';
import { Input } from '../input';
import { DefaultDateAdapter } from './date-adapter';

@Directive({
  standalone: true,
  selector: '[meeDatepickerTrigger]',
  exportAs: 'meeDatepickerTrigger',
  host: {
    '(click)': 'open()',
  },
})
export class DatepickerTrigger {
  el = inject(ElementRef);
  datepicker = input<DatePicker>();
  noOfCalendars = input(1, { transform: (v: number) => Math.max(1, v) });
  range = input(false);
  time = input(false);
  format = input<string>('MM-dd-yyyy');
  inputS = inject(Input);
  dateFilter = input<(date: Date) => boolean>(() => true);
  pickerType = input<'date' | 'month' | 'year'>('date');
  pickerTemplate = input<TemplateRef<any> | null>(null);
  adapter = new DefaultDateAdapter();
  popover = popoverPortal();
  close?: VoidFunction;

  constructor() {
    effect(() => {
      this.updateField(this.inputS.value() || []);
    });
  }

  open() {
    const data: DatePickerOptions = {
      value: this.inputS.value(),
      pickerType: this.pickerType(),
      noOfCalendars: this.noOfCalendars(),
      range: this.range(),
      format: this.format(),
      target: this.el.nativeElement,
      template: this.pickerTemplate(),
      dateFilter: this.dateFilter(),
      time: this.time(),
    };
    const { diaRef } = this.popover.open(
      DatePicker,
      { target: this.el.nativeElement, position: 'bl' },
      {
        data,
      },
    );
    this.close = diaRef.close;
  }

  updateInput(dates: (Date | null)[]) {
    const filtered = dates.filter((x) => x) as Date[];
    if (this.range()) {
      if (filtered.length === 1) {
        return;
      }
      this.inputS?.setValue(dates);
    } else if (filtered.length) {
      this.inputS?.setValue(dates[0]);
    }
    this.updateField(filtered);
  }

  updateField(filtered: Date[]) {
    const d = filtered
      .map((x) => this.adapter.format(x, this.format()))
      .filter((x) => x)
      .join(' - ');
    requestAnimationFrame(() => {
      this.el.nativeElement.value = d;
    });
  }
}

export interface DatePickerOptions {
  value: Date[];
  pickerType: 'date' | 'month' | 'year';
  noOfCalendars: number;
  range: boolean;
  format: string;
  target: any;
  template: TemplateRef<any> | null;
  dateFilter: (date: Date) => boolean;
  time: boolean;
}
