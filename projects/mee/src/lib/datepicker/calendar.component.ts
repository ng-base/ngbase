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

@Component({
  standalone: true,
  selector: 'mee-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, Button, Icons],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div class="mb-b2 flex items-center justify-between">
      <button
        meeButton
        variant="outline"
        class="h-b6 w-b6 rounded-md !px-0"
        [class]="!first() ? 'invisible' : ''"
        (click)="navigate(-1)"
      >
        <mee-icon name="lucideChevronLeft"></mee-icon>
      </button>
      <button
        meeButton
        variant="ghost"
        class="small rounded-md"
        (click)="toggleView()"
      >
        {{ title() }}
      </button>
      <button
        meeButton
        variant="outline"
        class="h-b6 w-b6 rounded-md !px-0"
        [class]="!last() ? 'invisible' : ''"
        (click)="navigate(1)"
      >
        <mee-icon name="lucideChevronRight"></mee-icon>
      </button>
    </div>

    @if (datePicker.showType() === 'year') {
      <div class="years">
        @for (year of years(); track year) {
          <button
            class="items-center justify-center rounded-md py-b2  hover:bg-muted-background"
            (click)="selectYear(year)"
            [ngClass]="[
              todayDay() && cStartYear() === year
                ? 'border bg-muted-background'
                : '',
              cStartYear() === year ? '!bg-primary text-foreground' : ''
            ]"
          >
            {{ year }}
          </button>
        }
      </div>
    } @else if (datePicker.showType() === 'month') {
      <div class="months">
        @for (month of months; track month.value) {
          <button
            class="items-center justify-center rounded-md py-b2  hover:bg-muted-background"
            (click)="selectMonth(month)"
            [ngClass]="{
              'border bg-muted-background':
                todayDay() && cStartMonth() === month.value,
              '!bg-primary text-foreground': datePicker
                .dates()
                .month.includes(month.value + 1 + '-' + cStartYear())
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
            (click)="selectDate(day.day)"
            #days
            class="mx-auto flex h-b9 w-b9 items-center justify-center text-center hover:bg-muted-background"
            [ngClass]="{
              'bg-muted-background':
                (day.day === todayDay() && day.current) ||
                (day.count <= datePicker.hoveredCount() &&
                  datePicker.startDateCount() &&
                  day.count >= datePicker.startDateCount()),
              'text-slate-400': !day.current || day.disabled,
              '!bg-primary text-foreground': datePicker
                .dates()
                .day.includes(day.day + '-' + day.mon + '-' + cStartYear())
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'inline-block min-h-[18.75rem] p-b2 w-[268px]',
  },
  styles: `
    // .day-names {
    // display: grid;
    // grid-template-columns: repeat(7, 1fr);
    // }

    // .day {
    //   text-align: center;
    // }

    // .header {
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   margin-bottom: 10px;
    // }

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
  first = input(false);
  last = input(false);
  index = input(0);

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

  years = signal(this.getYears(this.cStartYear()));
  readonly months = Array.from({ length: 12 }, (_, i) => {
    const name = new Date(0, i).toLocaleString('default', { month: 'long' });
    return { name: name.substring(0, 3), value: i };
  });

  // computed the title based on the type
  readonly title = computed(() => {
    const type = this.datePicker.showType();
    const month = this.selectedMonthName();
    const year = this.cStartYear();
    const years = this.years();
    const r =
      type === 'year'
        ? `${years[0]} - ${years[years.length - 1]} `
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
        mon: month + 1,
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
        mon: month,
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
        mon: month + 2,
        day: i + 1,
        disabled: !dateFilter?.(date) || false,
        current: false,
        count: date.getTime(),
      };
    });
    t.push(...daysArrayNext);
    return t;
  });

  todayDay = computed(() => {
    const today = new Date();
    return this.getSelectedDayOfMonth(today);
  });

  eventListeners: { element: HTMLElement; listener: () => void }[] = [];

  constructor() {
    effect(() => {
      const days = this.days();
      const range = this.datePicker.range();
      const dates = this.datePicker.selectedDates();
      this.clearListeners();

      if (days.length && range && dates[0] && !dates[1]) {
        const arr = this.getDaysArray();

        days.forEach((day, i) => {
          const listener = () => {
            this.hoverDate(arr[i].day, arr[i].mon - 1);
          };

          day.nativeElement.addEventListener('mouseover', listener);
          this.eventListeners.push({ element: day.nativeElement, listener });
        });
      }
    });
  }

  private getSelectedDayOfMonth(date: Date) {
    const r =
      this.cStartMonth() === date.getMonth() &&
      this.cStartYear() === date.getFullYear()
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

  selectDate(day: number) {
    const date = new Date(this.cStartYear(), this.cStartMonth(), day);
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
      this.years.set(this.getYears(selectedYear));
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

  getYears(year: number) {
    return Array.from({ length: 24 }, (_, i) => year - (24 - 6) + i);
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
