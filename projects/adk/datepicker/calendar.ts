import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChildren,
} from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';
import { Directionality } from '@ngbase/adk/bidi';
import { NgbDatePicker } from './datepicker';
import { NgbTimePicker } from './time';

@Directive({
  selector: '[ngbCalendarBtn]',
  host: {
    type: 'button',
    '[class]': '!visible() ? "invisible" : ""',
    '(click)': 'cal.navigate(ngbCalendarBtn() === "left" ? -1 : 1)',
    '[disabled]': 'disabled()',
    '[tabIndex]': 'disabled() ? -1 : 0',
  },
})
export class CalendarBtn<D> {
  readonly cal = inject<NgbCalendar<D>>(NgbCalendar);

  readonly ngbCalendarBtn = input.required<'left' | 'right'>();

  readonly disabled = computed(() => {
    return this.ngbCalendarBtn() === 'left' ? this.cal.leftBtn() : this.cal.rightBtn();
  });
  readonly visible = computed(() => {
    return this.ngbCalendarBtn() === 'left' ? this.cal.first() : this.cal.last();
  });
}

@Directive({
  selector: '[ngbCalendarTitle]',
  host: {
    type: 'button',
    '(click)': 'cal.toggleView()',
    '[tabIndex]': '0',
  },
})
export class CalendarTitle<D> {
  readonly cal = inject<NgbCalendar<D>>(NgbCalendar);
}

@Directive({
  selector: '[ngbCalYearBtn]',
  exportAs: 'ngbCalYearBtn',
  hostDirectives: [AccessibleItem],
  host: {
    type: 'button',
    '(click)': '!ngbCalYearBtn().disabled && cal.selectYear(ngbCalYearBtn().year)',
  },
})
export class CalendarYearBtn<D> {
  readonly cal = inject<NgbCalendar<D>>(NgbCalendar);
  readonly ally = inject(AccessibleItem);
  readonly ngbCalYearBtn = input.required<{ year: number; disabled: boolean }>();

  readonly active = computed(() => this.ngbCalYearBtn().year === this.cal.cStartYear());
  readonly selected = computed(() => this.cal.todayDay() && this.active());

  constructor() {
    this.ally._ayId.set(this.cal.datePicker.ayId);
    effect(() => {
      this.ally._data.set(this.ngbCalYearBtn());
    });
  }
}

@Directive({
  selector: '[ngbCalMonthBtn]',
  exportAs: 'ngbCalMonthBtn',
  hostDirectives: [AccessibleItem],
  host: {
    type: 'button',
    '(click)': '!ngbCalMonthBtn().disabled && cal.selectMonth(ngbCalMonthBtn())',
  },
})
export class CalendarMonthBtn<D> {
  readonly cal = inject<NgbCalendar<D>>(NgbCalendar);
  readonly ally = inject(AccessibleItem);
  readonly ngbCalMonthBtn = input.required<{ name: string; value: number; disabled: boolean }>();

  readonly active = computed(() =>
    this.cal.datePicker
      .dates()
      .month.includes(this.ngbCalMonthBtn().value + '-' + this.cal.cStartYear()),
  );
  readonly selected = computed(
    () => this.cal.todayDay() && this.cal.cStartMonth() === this.ngbCalMonthBtn().value,
  );

  constructor() {
    this.ally._ayId.set(this.cal.datePicker.ayId);
    effect(() => {
      this.ally._data.set(this.ngbCalMonthBtn());
    });
  }
}

@Directive({
  selector: '[ngbCalDayBtn]',
  exportAs: 'ngbCalDayBtn',
  hostDirectives: [AccessibleItem],
  host: {
    type: 'button',
    '(click)': '!ngbCalDayBtn().disabled && cal.selectDate(ngbCalDayBtn().day, ngbCalDayBtn().mon)',
  },
})
export class CalendarDayBtn<D> {
  readonly cal = inject<NgbCalendar<D>>(NgbCalendar);
  readonly ally = inject(AccessibleItem);
  readonly ngbCalDayBtn = input.required<{
    day: number;
    mon: number;
    disabled: boolean;
    current: boolean;
    count: number;
  }>();

  readonly active = computed(() =>
    this.cal.datePicker
      .dates()
      .day.includes(
        this.ngbCalDayBtn().day + '-' + this.ngbCalDayBtn().mon + '-' + this.cal.cStartYear(),
      ),
  );
  readonly dummy = computed(() => !this.ngbCalDayBtn().current || this.ngbCalDayBtn().disabled);
  readonly selected = computed(() => {
    const day = this.ngbCalDayBtn();
    return (
      (day.day === this.cal.todayDay() && day.current) ||
      (day.count <= this.cal.datePicker.hoveredCount() &&
        this.cal.datePicker.startDateCount() &&
        day.count >= this.cal.datePicker.startDateCount())
    );
  });

  constructor() {
    this.ally._ayId.set(this.cal.datePicker.ayId);
    effect(() => {
      this.ally._data.set(this.ngbCalDayBtn());
      this.ally._id.set(this.ngbCalDayBtn().day + '-' + this.ngbCalDayBtn().mon);
      this.ally._skip.set(this.ngbCalDayBtn().disabled);
    });
  }
}

@Component({
  selector: 'ngb-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgbTimePicker,
    CalendarBtn,
    CalendarTitle,
    CalendarYearBtn,
    CalendarMonthBtn,
    CalendarDayBtn,
  ],
  template: `
    <div class="mb-b2 flex items-center justify-between">
      <button ngbCalendarBtn="left">{{ dir.isRtl() ? '>' : '<' }}</button>
      <button ngbCalendarTitle>{{ title() }}</button>
      <button ngbCalendarBtn="right">{{ dir.isRtl() ? '<' : '>' }}</button>
    </div>

    @if (datePicker.showType() === 'year') {
      <div class="grid grid-cols-3">
        @for (year of years(); track year.year) {
          <button
            [ngbCalYearBtn]="year"
            #yearBtn="ngbCalYearBtn"
            class="items-center justify-center rounded-md py-b2 h-9 w-[84px] {{
              year.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            [ngClass]="{
              'border bg-muted-background': yearBtn.selected(),
              '!bg-primary text-foreground': yearBtn.active(),
            }"
          >
            {{ year.year }}
          </button>
        }
      </div>
    } @else if (datePicker.showType() === 'month') {
      <div class="grid grid-cols-3">
        @for (month of months(); track month.value) {
          <button
            [ngbCalMonthBtn]="month"
            #monthBtn="ngbCalMonthBtn"
            class="items-center justify-center rounded-md py-b2 h-9 w-[84px] {{
              month.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            [ngClass]="{
              'border bg-muted-background': monthBtn.selected(),
              '!bg-primary text-foreground': monthBtn.active(),
            }"
          >
            {{ month.name }}
          </button>
        }
      </div>
    } @else {
      <div class="day-names grid grid-cols-7">
        @for (dayName of dayNames; track dayName) {
          <div class="p-b text-center text-muted">{{ dayName }}</div>
        }
      </div>
      <div class="grid grid-cols-7 gap-y-b2">
        @for (day of getDaysArray(); track day.day + '-' + day.mon) {
          <button
            #days="ngbCalDayBtn"
            [ngbCalDayBtn]="day"
            class="mx-auto flex h-b9 w-b9 items-center justify-center text-center {{
              day.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            [ngClass]="{
              'bg-muted-background': days.selected(),
              'opacity-40': days.dummy(),
              '!bg-primary text-foreground': days.active(),
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
      @if (datePicker.time() && datePicker.range()) {
        <div ngbTime [(value)]="time1" (valueChange)="timeChanged(0, time1()!)"></div>
        <div ngbTime [(value)]="time2" (valueChange)="timeChanged(1, time2()!)"></div>
      }
    }
  `,
})
export class NgbCalendar<D> implements OnDestroy {
  readonly dir = inject(Directionality);
  readonly datePicker = inject<NgbDatePicker<D>>(NgbDatePicker);
  readonly days = viewChildren<CalendarDayBtn<D>, ElementRef<HTMLElement>>(CalendarDayBtn, {
    read: ElementRef,
  });
  readonly first = input(false);
  readonly last = input(false);
  readonly index = input(0);
  readonly time1 = signal<string | null>(null);
  readonly time2 = signal<string | null>(null);

  readonly cStartMonth = computed(() => {
    const month = this.datePicker.startMonth() + this.index();
    return month > 11 ? 12 - month : month;
  });

  readonly cStartYear = computed(() => {
    const year = this.datePicker.startYear();
    const month = this.datePicker.startMonth();
    const showType = this.datePicker.showType();
    const index = this.index();
    if (showType === 'date') {
      return year + Math.floor((month + index) / 12);
    } else if (showType === 'month') {
      return year + index;
    } else {
      return year + index * 24;
    }
  });

  readonly selectedMonthName = computed(() => {
    const date = this.adapter.create(this.cStartYear(), this.cStartMonth());
    return this.adapter.longMonthNames(date);
  });

  readonly currentYear = signal(this.cStartYear());
  readonly years = computed(() => {
    const year = this.currentYear();
    const filter = this.datePicker.dateFilter();
    return Array.from({ length: 18 }, (_, i) => {
      const y = year - (18 - 6) + i;
      return { year: y, disabled: !filter?.(this.adapter.create(y, 0)) };
    });
  });
  readonly months = computed(() => {
    const filter = this.datePicker.dateFilter();
    return Array.from({ length: 12 }, (_, i) => {
      const date = this.adapter.create(this.cStartYear(), i);
      const isDisabled = !filter?.(date);
      const name = this.adapter.longMonthNames(date);
      return { name: name.substring(0, 3), value: i, disabled: isDisabled };
    });
  });

  // computed the title based on the type
  readonly title = computed(() => {
    const type = this.datePicker.showType();
    const month = this.selectedMonthName();
    const year = this.cStartYear();
    const years = this.years();
    const r =
      type === 'year'
        ? `${years[0].year} - ${years[years.length - 1].year} `
        : type === 'month'
          ? year
          : month + ' ' + year;
    return r;
  });

  readonly dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // get the days array based on the month and year
  getDaysArray = computed(() => {
    const month = this.cStartMonth();
    const year = this.cStartYear();
    const dateFilter = this.datePicker.dateFilter();
    const numDays = this.adapter.getDate(this.adapter.create(year, month + 1, 0));
    const daysArray = Array.from({ length: numDays }, (_, i) => {
      const date = this.adapter.create(year, month, i + 1);
      return {
        mon: month,
        day: i + 1,
        year: this.adapter.getYear(date),
        disabled: !dateFilter?.(date) || false,
        current: true,
        count: this.adapter.getTime(date),
      };
    });
    const startDay = this.adapter.getDay(this.adapter.create(year, month));
    // get the additional days from the previous month
    const prevMonth = this.adapter.getDate(this.adapter.create(year, month, 0));
    const daysArrayPrev = Array.from({ length: startDay }, (_, i) => {
      const date = this.adapter.create(year, month - 1, prevMonth - startDay + i + 1);
      return {
        mon: this.adapter.getMonth(date),
        day: prevMonth - startDay + i + 1,
        year: this.adapter.getYear(date),
        disabled: !dateFilter?.(date) || false,
        current: false,
        count: this.adapter.getTime(date),
      };
    });
    const t = daysArrayPrev.concat(daysArray); // Padding for start day alignment
    // get the additional days from the next month to fill the last row
    // we need to check whether it is divisible by 7 and we have to fill only the remaining days
    const remaining = t.length % 7 === 0 ? 0 : 7 - (t.length % 7);
    const daysArrayNext = Array.from({ length: remaining }, (_, i) => {
      const date = this.adapter.create(year, month + 1, i + 1);
      return {
        mon: this.adapter.getMonth(date),
        day: i + 1,
        year: this.adapter.getYear(date),
        disabled: !dateFilter?.(date) || false,
        current: false,
        count: this.adapter.getTime(date),
      };
    });
    t.push(...daysArrayNext);
    return t;
  });

  // whether the left button is disabled based on the type
  // and disabled state
  leftBtn = computed(() => {
    const type = this.datePicker.showType();
    const year = this.cStartYear();
    const filter = this.datePicker.dateFilter();
    if (type === 'year') {
      return !filter?.(this.adapter.create(this.years()[0].year - 1, 11, 31));
    } else if (type === 'month') {
      return !filter?.(this.adapter.create(year - 1, 0));
    } else {
      return !filter?.(this.adapter.create(year, this.cStartMonth() - 1));
    }
  });

  // whether the right button is disabled based on the type
  // and disabled state
  rightBtn = computed(() => {
    const type = this.datePicker.showType();
    const year = this.cStartYear();
    const filter = this.datePicker.dateFilter();
    if (type === 'year') {
      return !filter?.(this.adapter.create(this.years()[this.years().length - 1].year + 1, 0));
    } else if (type === 'month') {
      return !filter?.(this.adapter.create(year + 1, 0));
    } else {
      return !filter?.(this.adapter.create(year, this.cStartMonth() + 1));
    }
  });

  todayDay = computed(() => {
    const today = this.adapter.now();
    return this.getSelectedDayOfMonth(today);
  });

  eventListeners: { element: HTMLElement; listener: () => void }[] = [];

  constructor() {
    if (this.datePicker.time() && this.datePicker.range()) {
      const [first, second] = this.datePicker.selectedDates();
      this.time1.set(first ? this.adapter.format(first, 'hh:mm a') : '');
      this.time2.set(second ? this.adapter.format(second, 'hh:mm a') : '');
    }
    effect(() => {
      const days = this.days();
      const range = this.datePicker.range();
      const dates = this.datePicker.selectedDates();
      this.clearListeners();

      if (days.length && range && dates[0] && !dates[1]) {
        const arr = this.getDaysArray();

        days.forEach((day, i) => {
          const listener = () => {
            this.hoverDate(arr[i].day, arr[i].mon);
          };

          day.nativeElement.addEventListener('mouseover', listener);
          this.eventListeners.push({ element: day.nativeElement, listener });
        });
      }
    });
  }

  get adapter() {
    return this.datePicker.adapter;
  }

  private getSelectedDayOfMonth(date: D) {
    const r =
      this.cStartMonth() === this.adapter.getMonth(date) &&
      this.cStartYear() === this.adapter.getYear(date)
        ? this.adapter.getDate(date)
        : 0;
    return r;
  }

  clearListeners() {
    this.eventListeners.forEach(({ element, listener }) => {
      element.removeEventListener('mouseover', listener);
    });
  }

  hoverDate(day: number, month: number) {
    this.datePicker.updateHoveredDate(this.adapter.create(this.cStartYear(), month, day));
  }

  timeChanged(index: number, timing: string) {
    const [time, period] = timing.split(' ');
    const [hours, min] = time.split(':').map(Number);
    const dates = this.datePicker.selectedDates();
    let date = dates[index]! as D;
    date = this.adapter.set(date, period === 'PM' ? hours + 12 : hours, 'hour');
    date = this.adapter.set(date, min, 'minute');

    this.datePicker.selectDate(date, index);
  }

  selectDate(day: number, month: number) {
    const date = this.adapter.create(this.cStartYear(), month, day);
    this.datePicker.selectDate(date);
  }

  navigate(direction: number) {
    let selectedYear = this.datePicker.startYear();
    let selectedMonth = this.datePicker.startMonth();
    const count = this.datePicker.noOfCalendar();
    direction = direction * count;
    const type = this.datePicker.showType();
    if (type === 'year') {
      selectedYear += direction * 24;
      this.currentYear.set(selectedYear);
    } else if (type === 'month') {
      selectedYear += direction;
    } else {
      selectedMonth += direction;
      if (selectedMonth < 0) {
        selectedMonth = 12 + selectedMonth;
        selectedYear--;
      } else if (selectedMonth > 11) {
        selectedMonth = selectedMonth - 12;
        selectedYear++;
      }
    }

    this.datePicker.startYear.set(selectedYear);
    this.datePicker.startMonth.set(selectedMonth);
  }

  selectYear(year: number) {
    this.datePicker.selectYear(year);
  }

  selectMonth(month: any) {
    this.datePicker.selectMonth(month.value, this.cStartYear());
  }

  toggleView() {
    this.datePicker.toggleView();
  }

  ngOnDestroy(): void {
    this.clearListeners();
  }
}

export function provideCalendar<D>(cal: typeof NgbCalendar) {
  return {
    provide: NgbCalendar,
    useExisting: cal,
  };
}
