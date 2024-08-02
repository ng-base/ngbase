import {
  Component,
  signal,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
  viewChildren,
  effect,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Button } from '../button';
import { DatePicker } from './datepicker.component';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Icons } from '../icon';
import { TimePicker } from './time.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'mee-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Icons, TimePicker, FormsModule],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div class="mb-b2 flex items-center justify-between">
      <button
        meeButton
        variant="outline"
        class="h-b6 w-b6 rounded-md !px-0"
        [class]="!first() ? 'invisible' : ''"
        (click)="navigate(-1)"
        [disabled]="leftBtn()"
      >
        <mee-icon name="lucideChevronLeft"></mee-icon>
      </button>
      <button meeButton variant="ghost" class="small rounded-md" (click)="toggleView()">
        {{ title() }}
      </button>
      <button
        meeButton
        variant="outline"
        class="h-b6 w-b6 rounded-md !px-0"
        [class]="!last() ? 'invisible' : ''"
        (click)="navigate(1)"
        [disabled]="rightBtn()"
      >
        <mee-icon name="lucideChevronRight"></mee-icon>
      </button>
    </div>

    @if (datePicker.showType() === 'year') {
      <div class="years">
        @for (year of years(); track year.year) {
          <button
            class="items-center justify-center rounded-md py-b2 {{
              year.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            (click)="!year.disabled && selectYear(year.year)"
            [ngClass]="[
              todayDay() && cStartYear() === year.year ? 'border bg-muted-background' : '',
              cStartYear() === year.year ? '!bg-primary text-foreground' : '',
            ]"
          >
            {{ year.year }}
          </button>
        }
      </div>
    } @else if (datePicker.showType() === 'month') {
      <div class="months">
        @for (month of months(); track month.value) {
          <button
            class="items-center justify-center rounded-md py-b2 {{
              month.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            (click)="!month.disabled && selectMonth(month)"
            [ngClass]="{
              'border bg-muted-background': todayDay() && cStartMonth() === month.value,
              '!bg-primary text-foreground': datePicker
                .dates()
                .month.includes(month.value + '-' + cStartYear()),
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
        @for (day of getDaysArray(); track $index) {
          <button
            #days
            (click)="!day.disabled && selectDate(day.day, day.mon)"
            class="mx-auto flex h-b9 w-b9 items-center justify-center text-center {{
              day.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted-background'
            }}"
            [ngClass]="{
              'bg-muted-background':
                (day.day === todayDay() && day.current) ||
                (day.count <= datePicker.hoveredCount() &&
                  datePicker.startDateCount() &&
                  day.count >= datePicker.startDateCount()),
              'text-slate-400': !day.current || day.disabled,
              '!bg-primary text-foreground': datePicker
                .dates()
                .day.includes(day.day + '-' + day.mon + '-' + cStartYear()),
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
      @if (datePicker.time() && datePicker.range()) {
        <mee-time
          class="mt-b5 w-full"
          [(ngModel)]="time1"
          (ngModelChange)="timeChanged(0, time1()!)"
        ></mee-time>
        <mee-time
          class="mt-b5 w-full"
          [(ngModel)]="time2"
          (ngModelChange)="timeChanged(1, time2()!)"
        ></mee-time>
      }
    }
  `,
  host: {
    class: 'inline-flex flex-col min-h-[18.75rem] p-b2 w-full',
  },
  styles: `
    .years,
    .months {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
  `,
})
export class Calendar implements OnDestroy {
  datePicker = inject(DatePicker);
  days = viewChildren<ElementRef<HTMLElement>>('days');
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
    const date = new Date(this.cStartYear(), this.cStartMonth());
    return date.toLocaleString('default', { month: 'long' });
  });

  readonly currentYear = signal(this.cStartYear());
  readonly years = computed(() => {
    const year = this.currentYear();
    const filter = this.datePicker.dateFilter();
    return Array.from({ length: 24 }, (_, i) => {
      const y = year - (24 - 6) + i;
      return { year: y, disabled: !filter?.(new Date(y, 0)) };
    });
  });
  readonly months = computed(() => {
    const filter = this.datePicker.dateFilter();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(this.cStartYear(), i);
      const isDisabled = !filter?.(date);
      const name = date.toLocaleString('default', { month: 'long' });
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
    const numDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numDays }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        mon: month,
        day: i + 1,
        disabled: !dateFilter?.(date) || false,
        current: true,
        count: date.getTime(),
      };
    });
    const startDay = new Date(year, month).getDay();
    // get the additional days from the previous month
    const prevMonth = new Date(year, month, 0).getDate();
    const daysArrayPrev = Array.from({ length: startDay }, (_, i) => {
      const date = new Date(year, month - 1, prevMonth - startDay + i + 1);
      return {
        mon: month - 1,
        day: prevMonth - startDay + i + 1,
        disabled: !dateFilter?.(date) || false,
        current: false,
        count: date.getTime(),
      };
    });
    const t = daysArrayPrev.concat(daysArray); // Padding for start day alignment
    // get the additional days from the next month to fill the last row
    // we need to check whether it is divisible by 7 and we have to fill only the remaining days
    const remaining = t.length % 7 === 0 ? 0 : 7 - (t.length % 7);
    const daysArrayNext = Array.from({ length: remaining }, (_, i) => {
      const date = new Date(year, month + 1, i + 1);
      return {
        mon: month + 1,
        day: i + 1,
        disabled: !dateFilter?.(date) || false,
        current: false,
        count: date.getTime(),
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
      return !filter?.(new Date(this.years()[0].year - 1, 11, 31));
    } else if (type === 'month') {
      return !filter?.(new Date(year - 1, 0));
    } else {
      return !filter?.(new Date(year, this.cStartMonth() - 1));
    }
  });

  // whether the right button is disabled based on the type
  // and disabled state
  rightBtn = computed(() => {
    const type = this.datePicker.showType();
    const year = this.cStartYear();
    const filter = this.datePicker.dateFilter();
    if (type === 'year') {
      return !filter?.(new Date(this.years()[this.years().length - 1].year + 1, 0));
    } else if (type === 'month') {
      return !filter?.(new Date(year + 1, 0));
    } else {
      return !filter?.(new Date(year, this.cStartMonth() + 1));
    }
  });

  todayDay = computed(() => {
    const today = new Date();
    return this.getSelectedDayOfMonth(today);
  });

  eventListeners: { element: HTMLElement; listener: () => void }[] = [];

  constructor() {
    if (this.datePicker.time() && this.datePicker.range()) {
      const dates = this.datePicker.selectedDates();
      this.time1.set(this.datePicker.adapter.format(dates[0]!, 'hh:mm a'));
      this.time2.set(this.datePicker.adapter.format(dates[1]!, 'hh:mm a'));
    }
    effect(
      () => {
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
      },
      { allowSignalWrites: true },
    );
  }

  private getSelectedDayOfMonth(date: Date) {
    const r =
      this.cStartMonth() === date.getMonth() && this.cStartYear() === date.getFullYear()
        ? date.getDate()
        : 0;
    return r;
  }

  clearListeners() {
    this.eventListeners.forEach(({ element, listener }) => {
      element.removeEventListener('mouseover', listener);
    });
  }

  hoverDate(day: number, month: number) {
    this.datePicker.updateHoveredDate(new Date(this.cStartYear(), month, day));
  }

  timeChanged(index: number, timing: string) {
    const [time, period] = timing.split(' ');
    const [hours, min] = time.split(':').map(Number);
    const dates = this.datePicker.selectedDates();
    const date = dates[index]!;
    date.setHours(period === 'PM' ? hours + 12 : hours, min);

    this.datePicker.selectDate(date, index);
  }

  selectDate(day: number, month: number) {
    const date = new Date(this.cStartYear(), month, day);
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
