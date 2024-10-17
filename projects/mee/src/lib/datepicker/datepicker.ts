import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
  TemplateRef,
  viewChild,
  model,
} from '@angular/core';
import { Button } from '../button';
import { DialogRef } from '../portal';
import { Calendar } from './calendar';
import { generateId, RangePipe } from '../utils';
import { DatePickerOptions, DatepickerTrigger } from './datepicker-trigger';
import { injectMeeDateAdapter } from './native-date-adapter';
import { AccessibleGroup, AccessibleItem } from '../a11y';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Calendar, RangePipe, NgTemplateOutlet, AccessibleGroup],
  template: `
    <div
      class="flex"
      meeAccessibleGroup
      [ayId]="ayId"
      [columns]="7"
      [initialFocus]="false"
      (focusChanged)="focusChanged($event)"
    >
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
export class DatePicker<D> {
  private datepickerTrigger: DatepickerTrigger<D> | null = inject(DatepickerTrigger, {
    optional: true,
  });
  private dialogRef = inject<DialogRef<DatePickerOptions<D>>>(DialogRef, { optional: true });
  readonly adapter = injectMeeDateAdapter<D>();
  readonly dateFilter = input(this.data?.dateFilter || (() => true));
  readonly pickerType = input<'date' | 'month' | 'year'>(this.data?.pickerType || 'date');
  readonly allyGroup = viewChild(AccessibleGroup);

  readonly noOfCalendar = model(this.data?.noOfCalendars || 1);
  readonly range = model<boolean>(this.data?.range || false);
  readonly time = signal<boolean>(this.data?.time || false);
  readonly format = signal<string>(
    this.data?.format || `MM-dd-yyyy${this.data?.time ? ' HH:mm a' : ''}`,
  );
  readonly template = signal<TemplateRef<any> | null>(this.data?.template || null);

  readonly showType = signal<'date' | 'month' | 'year'>(this.pickerType());
  readonly selectedDates = signal<[D | null, D | null]>([null, null]);
  readonly times = signal<[string | null, string | null]>([null, null]);
  readonly startDate = computed<D>(() => {
    const dates = this.selectedDates();
    return Array.isArray(dates) && dates[0] ? dates[0] : this.adapter.now();
  });
  readonly startMonth = signal(this.adapter.getMonth(this.startDate()));
  readonly startYear = signal(this.adapter.getYear(this.startDate()));

  readonly hoveredDate = signal<D | null>(null);
  readonly hoveredCount = computed(() => {
    const date = this.hoveredDate();
    return date ? this.adapter.getTime(date) : 0;
  });

  readonly startDateCount = computed(() => {
    const date = this.selectedDates()[0];
    return date ? this.adapter.getTime(date) : 0;
  });

  readonly dates = computed(() => {
    const dates = this.selectedDates();

    const v = { year: [] as number[], month: [] as string[], day: [] as string[] };
    for (const x of dates) {
      if (x) {
        const year = this.adapter.getYear(x);
        const month = this.adapter.getMonth(x);
        const day = this.adapter.getDate(x);
        v.year.push(year);
        v.month.push(`${month}-${year}`);
        v.day.push(`${day}-${month}-${year}`);
      }
    }
    return v;
  });

  readonly ayId = generateId();

  constructor() {
    this.init();
    // this.allyGroup.focusChanged.subscribe(item => this.focusChanged(item));
  }

  private init() {
    const v = this.data?.value?.filter(x => x).map(x => this.adapter.parse(x));
    if (Array.isArray(v) && v.length) {
      let date: D;
      let dates: [D, D | null];
      if (v.length === 2) {
        dates = v as [D, D];
        this.hoveredDate.set(v[1]);
      } else {
        dates = [v[0], null];
      }
      date = dates[0];
      this.selectedDates.set(dates);
      this.startYear.set(this.adapter.getYear(date));
      this.startMonth.set(this.adapter.getMonth(date));
    }
  }

  get data() {
    return this.dialogRef?.data;
  }

  focusChanged(item: { current: AccessibleItem; previous?: AccessibleItem }) {
    const cData = item.current.data();
    const pData = item.previous?.data();
    // console.log('focusChanged', cData, pData);
    // console.log(data);
    if (cData.day) {
      let add = 0;
      // if (pData) {
      //   const v = (cData.day - pData.day) / 7;
      //   console.log(Math.abs(1));
      //   if (1 === Math.abs(v)) {
      //     add = 0;
      //   } else if (v > 0) {
      //     add = -1;
      //   } else {
      //     add = 1;
      //   }
      // }
      // console.log(add);
      // this.startMonth.set(cData.mon + add);
    }
  }

  updateHoveredDate(date: D) {
    if (this.range()) {
      const single = this.selectedDates().filter(x => x).length === 1;
      this.hoveredDate.set(single ? date : null);
    }
  }

  selectDate(date: D, index?: number) {
    let dates = this.selectedDates();
    if (index != undefined) {
      dates[index] = date;
    } else if (this.range()) {
      if ((dates[0] && dates[1]) || !dates[0] || this.adapter.compare(dates[0], date) > 0) {
        dates = [date, null];
        this.hoveredDate.set(null);
      } else if (dates[0]) {
        dates[1] = date;
        this.hoveredDate.set(date);
      }
    } else {
      dates = [date, null];
    }
    this.selectedDates.set([...dates]);
    this.datepickerTrigger?.updateInput(dates as D[]);
  }

  selectYear(year: number) {
    this.startYear.set(year);
    if (this.pickerType() !== 'year') {
      this.showType.set('month');
    } else {
      this.selectDate(this.adapter.create(year, this.startMonth()));
    }
  }

  selectMonth(month: number, year: number) {
    this.startMonth.set(month);
    this.startYear.set(year);
    if (this.pickerType() === 'date') {
      this.showType.set('date');
    } else {
      this.selectDate(this.adapter.create(year, month));
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
