import { NgClass } from '@angular/common';
import {
  Component,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
  effect,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../button';
import { Input } from '../input';
import { DialogRef } from '../portal';
import { Calendar } from './calendar.component';
import { RangePipe } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  imports: [NgClass, Button, Calendar, RangePipe],
  template: ` @for (no of noOfCalendar() | range; track no) {
    <mee-calendar
      [first]="$first"
      [last]="$last"
      [index]="$index"
    ></mee-calendar>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex',
  },
})
export class DatePicker {
  inputS = inject(Input, { optional: true });
  private dialogRef = inject(DialogRef, { optional: true });
  noOfCalendar = signal(1);
  range = signal(false);
  dateFilter = input<(date: Date) => boolean>((d) => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  });
  pickerType = input<'date' | 'month' | 'year'>('date');
  showType = signal<'date' | 'month' | 'year'>('date');
  readonly currentDate$ = new Subject<Date>();
  selectedDate = outputFromObservable(this.currentDate$);
  readonly currentDate = signal(new Date());
  readonly selectedMonth = signal(this.currentDate().getMonth());
  readonly selectedYear = signal(this.currentDate().getFullYear());

  constructor() {
    this.noOfCalendar.set(this.dialogRef?.data.noOfCalendars || 1);
    const v = this.inputS?.value();
    if (v) {
      this.currentDate.set(v);
      this.selectedYear.set(v.getFullYear());
      this.selectedMonth.set(v.getMonth());
    }
    effect(
      () => {
        this.showType.set(this.pickerTypeData);
      },
      { allowSignalWrites: true },
    );
  }

  get pickerTypeData() {
    return this.dialogRef?.data.pickerType || this.pickerType();
  }

  selectDate(date: Date) {
    this.currentDate.set(date);
    this.currentDate$.next(date);
    this.inputS?.setValue(date);
  }

  selectYear(year: number) {
    this.selectedYear.set(year);
    if (this.pickerTypeData !== 'year') {
      this.showType.set('month');
    } else {
      this.inputS?.setValue(new Date(year, this.selectedMonth()));
    }
  }

  selectMonth(month: number, year: number) {
    this.selectedMonth.set(month);
    this.selectedYear.set(year);
    if (this.pickerTypeData === 'date') {
      this.showType.set('date');
    } else {
      this.inputS?.setValue(new Date(year, month));
    }
  }

  toggleView() {
    let type = this.showType();
    if (type === 'date') {
      type = 'month';
    } else if (type === 'month' || this.pickerTypeData === 'year') {
      type = 'year';
    } else if (this.pickerTypeData === 'date') {
      type = 'date';
    } else {
      type = 'month';
    }
    this.showType.set(type);
  }
}
