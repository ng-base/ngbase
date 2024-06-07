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
import { Button } from '../button';
import { Input } from '../input';
import { DialogRef } from '../portal';
import { Calendar } from './calendar.component';
import { RangePipe } from '../utils';
import { DefaultDateAdapter } from './date-adapter';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Calendar, RangePipe],
  template: ` @for (no of noOfCalendar() | range; track no) {
    <mee-calendar
      [first]="$first"
      [last]="$last"
      [index]="$index"
    ></mee-calendar>
  }`,
  host: {
    class: 'flex',
  },
})
export class DatePicker {
  inputS = inject(Input, { optional: true });
  private dialogRef = inject(DialogRef, { optional: true });
  noOfCalendar = signal(this.dialogRef?.data.noOfCalendars || 1);
  range = signal<boolean>(this.dialogRef?.data.range || false);
  format = signal<string>(this.dialogRef?.data.format || 'MM-dd-yyyy');
  adapter = new DefaultDateAdapter();
  dateFilter = input<(date: Date) => boolean>((d) => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  });
  pickerType = input<'date' | 'month' | 'year'>('date');
  showType = signal<'date' | 'month' | 'year'>('date');
  // readonly currentDate$ = new Subject<Date>();
  // selectedDate = outputFromObservable(this.currentDate$);
  selectedDates = signal<[Date | null, Date | null]>([null, null]);
  readonly startDate = computed<Date>(() => {
    const dates = this.selectedDates();
    return Array.isArray(dates) && dates[0] ? dates[0] : new Date();
  });
  readonly startMonth = signal(this.startDate().getMonth());
  readonly startYear = signal(this.startDate().getFullYear());
  hoveredDate = signal<Date | null>(null);
  hoveredCount = computed(() => {
    const date = this.hoveredDate();
    return date ? date.getTime() : 0;
  });
  startDateCount = computed(() => {
    const date = this.selectedDates()[0];
    return date?.getTime() || 0;
  });

  dates = computed(() => {
    const dates = this.selectedDates();

    const v = {
      year: dates.map((x) => x?.getFullYear()),
      month: dates.map((x) =>
        x ? `${x.getMonth() + 1}-${x.getFullYear()}` : '',
      ),
      day: dates.map((x) =>
        x ? `${x.getDate()}-${x.getMonth() + 1}-${x.getFullYear()}` : '',
      ),
    };
    // return this.getSelectedDayOfMonth(today);
    return v;
  });

  constructor() {
    const v = this.inputS?.value();
    if (v) {
      let date: Date;
      if (Array.isArray(v)) {
        this.selectedDates.set(v as [Date, Date]);
        date = v[0];
        this.hoveredDate.set(v[1]);
      } else {
        date = v;
        this.selectedDates.set([v, null] as [Date, null]);
      }
      this.startYear.set(date.getFullYear());
      this.startMonth.set(date.getMonth());
    }
    effect(
      () => {
        this.showType.set(this.pickerTypeData);
      },
      { allowSignalWrites: true },
    );
  }

  updateHoveredDate(date: Date) {
    if (this.range()) {
      const single = this.selectedDates().filter((x) => x).length === 1;
      this.hoveredDate.set(single ? date : null);
    }
  }

  get pickerTypeData() {
    return this.dialogRef?.data.pickerType || this.pickerType();
  }

  selectDate(date: Date) {
    const dates = this.selectedDates();
    if (this.range()) {
      if (
        (dates[0] && dates[1]) ||
        !dates[0] ||
        dates[0].getTime() > date.getTime()
      ) {
        dates[0] = date;
        dates[1] = null;
        this.hoveredDate.set(null);
      } else if (dates[0]) {
        dates[1] = date;
      } else {
        dates[0] = date;
        this.hoveredDate.set(null);
      }
    } else {
      dates[0] = date;
    }
    this.selectedDates.set([...dates]);
    // this.currentDate$.next(date);
    this.updateInput(dates as Date[]);
  }

  updateInput(dates: Date[]) {
    if (this.range()) {
      if (dates.filter((x) => x).length === 1) {
        return;
      }
      this.inputS?.setValue(dates);
    } else {
      this.inputS?.setValue(dates[0]);
    }

    const d = dates
      .map((x) => (x ? this.adapter.format(x, this.format()) : null))
      .filter((x) => x)
      .join(' - ');
    requestAnimationFrame(() => {
      if (this.dialogRef?.data.target) {
        this.dialogRef.data.target.value = d;
      }
    });
  }

  selectYear(year: number) {
    this.startYear.set(year);
    if (this.pickerTypeData !== 'year') {
      this.showType.set('month');
    } else {
      // this.updateInput([new Date(year, this.startMonth())]);
      this.selectDate(new Date(year, this.startMonth()));
    }
  }

  selectMonth(month: number, year: number) {
    this.startMonth.set(month);
    this.startYear.set(year);
    if (this.pickerTypeData === 'date') {
      this.showType.set('date');
    } else {
      const date = new Date(year, month);
      this.selectDate(date);
      // this.selectedDates.set([date, null]);
      // this.updateInput([date]);
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

class DateData {
  readonly currentDate = signal(new Date());
  readonly selectedMonth = signal(this.currentDate().getMonth());
  readonly selectedYear = signal(this.currentDate().getFullYear());
}
