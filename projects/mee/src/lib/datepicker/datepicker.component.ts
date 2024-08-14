import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
  effect,
  TemplateRef,
} from '@angular/core';
import { Button } from '../button';
import { Input } from '../input';
import { DialogRef } from '../portal';
import { Calendar } from './calendar.component';
import { RangePipe } from '../utils';
import { DefaultDateAdapter } from './date-adapter';
import { DatePickerOptions, DatepickerTrigger } from './datepicker-trigger.directive';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Calendar, RangePipe, NgTemplateOutlet],
  template: `
    <div class="flex">
      @for (no of noOfCalendar() | range; track no) {
        <mee-calendar [first]="$first" [last]="$last" [index]="$index"></mee-calendar>
      }
    </div>
    @if (template()) {
      <div class="px-b2 pb-b2">
        <ng-container *ngTemplateOutlet="template()"></ng-container>
      </div>
    }
  `,
  host: {
    class: 'inline-block',
  },
})
export class DatePicker {
  datepickerTrigger = inject(DatepickerTrigger, { optional: true });
  private dialogRef = inject<DialogRef<DatePickerOptions>>(DialogRef, {
    optional: true,
  });
  adapter = new DefaultDateAdapter();
  readonly noOfCalendar = signal(this.data?.noOfCalendars || 1);
  range = signal<boolean>(this.data?.range || false);
  readonly time = signal<boolean>(this.data?.time || false);
  readonly format = signal<string>(
    this.data?.format || `MM-dd-yyyy${this.data?.time ? ' HH:mm a' : ''}`,
  );
  readonly template = signal<TemplateRef<any> | null>(this.data?.template || null);
  readonly dateFilter = input<(date: Date) => boolean>(this.data?.dateFilter || (() => true));
  readonly pickerType = input<'date' | 'month' | 'year'>(this.data?.pickerType || 'date');
  readonly showType = signal<'date' | 'month' | 'year'>(this.pickerType());
  readonly selectedDates = signal<[Date | null, Date | null]>([null, null]);
  readonly times = signal<[string | null, string | null]>([null, null]);
  readonly startDate = computed<Date>(() => {
    const dates = this.selectedDates();
    return Array.isArray(dates) && dates[0] ? dates[0] : new Date();
  });
  readonly startMonth = signal(this.startDate().getMonth());
  readonly startYear = signal(this.startDate().getFullYear());

  readonly hoveredDate = signal<Date | null>(null);
  readonly hoveredCount = computed(() => {
    const date = this.hoveredDate();
    return date ? date.getTime() : 0;
  });

  readonly startDateCount = computed(() => {
    const date = this.selectedDates()[0];
    return date?.getTime() || 0;
  });

  readonly dates = computed(() => {
    const dates = this.selectedDates();

    const v = {
      year: dates.map(x => x?.getFullYear()),
      month: dates.map(x => (x ? `${x.getMonth()}-${x.getFullYear()}` : '')),
      day: dates.map(x => (x ? `${x.getDate()}-${x.getMonth()}-${x.getFullYear()}` : '')),
    };
    return v;
  });

  constructor() {
    this.init();
  }

  private init() {
    const v = this.data?.value?.filter(x => x).map(x => this.adapter.parse(x));
    if (Array.isArray(v) && v.length) {
      let date: Date;
      let dates: [Date, Date | null];
      if (v.length === 2) {
        dates = v as [Date, Date];
        this.hoveredDate.set(v[1]);
      } else {
        dates = [v[0], null];
      }
      date = dates[0];
      this.selectedDates.set(dates);
      this.startYear.set(date.getFullYear());
      this.startMonth.set(date.getMonth());
    }
  }

  get data() {
    return this.dialogRef?.data;
  }

  updateHoveredDate(date: Date) {
    if (this.range()) {
      const single = this.selectedDates().filter(x => x).length === 1;
      this.hoveredDate.set(single ? date : null);
    }
  }

  selectDate(date: Date, index?: number) {
    let dates = this.selectedDates();
    if (index != undefined) {
      dates[index] = date;
    } else if (this.range()) {
      if ((dates[0] && dates[1]) || !dates[0] || dates[0].getTime() > date.getTime()) {
        dates = [date, null];
        this.hoveredDate.set(null);
      } else if (dates[0]) {
        dates[1] = date;
      }
      // else {
      //   dates[0] = date;
      //   this.hoveredDate.set(null);
      // }
    } else {
      dates = [date, null];
    }
    this.selectedDates.set([...dates]);
    this.datepickerTrigger?.updateInput(dates as Date[]);
  }

  selectYear(year: number) {
    this.startYear.set(year);
    if (this.pickerType() !== 'year') {
      this.showType.set('month');
    } else {
      this.selectDate(new Date(year, this.startMonth()));
    }
  }

  selectMonth(month: number, year: number) {
    this.startMonth.set(month);
    this.startYear.set(year);
    if (this.pickerType() === 'date') {
      this.showType.set('date');
    } else {
      this.selectDate(new Date(year, month));
    }
  }

  toggleView() {
    let type = this.showType();
    if (type === 'date') {
      type = 'month';
    } else if (type === 'month' || this.pickerType() === 'year') {
      type = 'year';
    } else if (this.pickerType() === 'date') {
      type = 'date';
    } else {
      type = 'month';
    }
    this.showType.set(type);
  }
}
