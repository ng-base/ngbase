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
import {
  DatePickerOptions,
  DatepickerTrigger,
} from './datepicker-trigger.directive';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Calendar, RangePipe, NgTemplateOutlet],
  template: `
    <div class="flex flex-col">
      @for (no of noOfCalendar() | range; track no) {
        <mee-calendar
          [first]="$first"
          [last]="$last"
          [index]="$index"
        ></mee-calendar>
      }
    </div>
    @if (template()) {
      <div class="px-b2 pb-b2">
        <ng-container *ngTemplateOutlet="template()"></ng-container>
      </div>
    }
  `,
})
export class DatePicker {
  inputS = inject(DatepickerTrigger, { optional: true });
  private dialogRef = inject<DialogRef<DatePickerOptions>>(DialogRef, {
    optional: true,
  });
  noOfCalendar = signal(this.data?.noOfCalendars || 1);
  range = signal<boolean>(this.data?.range || false);
  time = signal<boolean>(this.data?.time || false);
  format = signal<string>(this.data?.format || 'MM-dd-yyyy');
  adapter = new DefaultDateAdapter();
  template = signal<TemplateRef<any> | null>(this.data?.template || null);
  dateFilter = input<(date: Date) => boolean>(
    this.data?.dateFilter || (() => true),
  );
  pickerType = input<'date' | 'month' | 'year'>(
    this.data?.pickerType || 'date',
  );
  showType = signal<'date' | 'month' | 'year'>(this.pickerType());
  selectedDates = signal<[Date | null, Date | null]>([null, null]);
  times = signal<[string | null, string | null]>([null, null]);
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
      month: dates.map((x) => (x ? `${x.getMonth()}-${x.getFullYear()}` : '')),
      day: dates.map((x) =>
        x ? `${x.getDate()}-${x.getMonth()}-${x.getFullYear()}` : '',
      ),
    };
    // return this.getSelectedDayOfMonth(today);
    return v;
  });

  constructor() {
    const v = this.data?.value?.filter((x) => x);
    if ((Array.isArray(v) && v.length === 2) || v instanceof Date) {
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
    // effect(
    //   () => {
    //     this.showType.set(this.pickerTypeData);
    //   },
    //   { allowSignalWrites: true },
    // );
  }

  get data() {
    return this.dialogRef?.data;
  }

  updateHoveredDate(date: Date) {
    if (this.range()) {
      const single = this.selectedDates().filter((x) => x).length === 1;
      this.hoveredDate.set(single ? date : null);
    }
  }

  selectDate(date: Date, index?: number) {
    const dates = this.selectedDates();
    if (index != undefined) {
      dates[index] = date;
    } else if (this.range()) {
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
    this.inputS?.updateInput(dates as Date[]);
  }

  selectYear(year: number) {
    this.startYear.set(year);
    if (this.pickerType() !== 'year') {
      this.showType.set('month');
    } else {
      // this.updateInput([new Date(year, this.startMonth())]);
      this.selectDate(new Date(year, this.startMonth()));
    }
  }

  selectMonth(month: number, year: number) {
    this.startMonth.set(month);
    this.startYear.set(year);
    if (this.pickerType() === 'date') {
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

class DateData {
  readonly currentDate = signal(new Date());
  readonly selectedMonth = signal(this.currentDate().getMonth());
  readonly selectedYear = signal(this.currentDate().getFullYear());
}
