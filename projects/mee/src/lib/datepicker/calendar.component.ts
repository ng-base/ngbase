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
import { DialogRef } from '../portal';
import { DatePicker } from './datepicker.component';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';

@Component({
  standalone: true,
  selector: 'mee-calendar',
  imports: [NgClass, Button, Icons],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <div class="header">
      <button
        meeButton
        variant="outline"
        class="small h-7 w-7 rounded-md"
        [class]="!first() ? 'invisible' : ''"
        (click)="navigate(-1)"
      >
        <mee-icon name="lucideChevronLeft"></mee-icon>
      </button>
      <button
        meeButton
        variant="ghost"
        class="small rounded-md px-3 py-1"
        (click)="toggleView()"
      >
        {{ title() }}
      </button>
      <button
        meeButton
        variant="outline"
        class="small h-7 w-7 rounded-md"
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
            class="items-center justify-center rounded-md py-2  hover:bg-lighter"
            (click)="selectYear(year)"
            [ngClass]="[
              todayDay() && cSelectedYear() === year
                ? 'border border-border bg-lighter'
                : '',
              cSelectedYear() === year ? '!bg-primary text-foreground' : ''
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
            class="items-center justify-center rounded-md py-2  hover:bg-lighter"
            (click)="selectMonth(month)"
            [ngClass]="[
              todayDay() && cSelectedMonth() === month.value
                ? 'border border-border bg-lighter'
                : '',
              cSelectedMonth() === month.value
                ? '!bg-primary text-foreground'
                : ''
            ]"
          >
            {{ month.name }}
          </button>
        }
      </div>
    } @else {
      <div class="day-names">
        @for (dayName of dayNames; track dayName) {
          <div class="p-1 text-center text-muted">{{ dayName }}</div>
        }
      </div>
      <div class="days">
        @for (day of getDaysArray(); track $index) {
          <button
            (click)="selectDate(day.day)"
            class="day mx-auto flex h-9 w-9 items-center justify-center rounded-md hover:bg-lighter"
            [ngClass]="{
              'bg-lighter': day.day === todayDay() && day.current,
              'text-slate-400': !day.current || day.disabled,
              '!bg-primary text-foreground':
                day.day === selectedDay() && day.current
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block min-h-[18.75rem] p-2 w-[268px]',
  },
  styles: `
    .day-names {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .day {
      text-align: center;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

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
export class Calendar {
  datePicker = inject(DatePicker);
  first = input(false);
  last = input(false);
  index = input(0);

  readonly cSelectedMonth = computed(() => {
    const month = this.datePicker.selectedMonth() + this.index();
    return month > 11 ? 12 - month : month;
  });
  readonly cSelectedYear = computed(() => {
    const year = this.datePicker.selectedYear();
    const month = this.datePicker.selectedMonth();
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
    const date = new Date(this.cSelectedYear(), this.cSelectedMonth());
    return date.toLocaleString('default', { month: 'long' });
  });
  years = signal(this.getYears(this.cSelectedYear()));
  readonly months = Array.from({ length: 12 }, (_, i) => {
    const name = new Date(0, i).toLocaleString('default', { month: 'long' });
    return { name: name.substring(0, 3), value: i };
  });

  // computed the title based on the type
  readonly title = computed(() => {
    const type = this.datePicker.showType();
    const month = this.selectedMonthName();
    const year = this.cSelectedYear();
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
    const month = this.cSelectedMonth();
    const year = this.cSelectedYear();
    const dateFilter = this.datePicker.dateFilter();
    const numDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numDays }, (_, i) => ({
      mon: month + 1,
      day: i + 1,
      disabled: !dateFilter?.(new Date(year, month, i + 1)) || false,
      current: true,
    }));
    const startDay = new Date(year, month).getDay();
    // get the additional days from the previous month
    const prevMonth = new Date(year, month, 0).getDate();
    const daysArrayPrev = Array.from({ length: startDay }, (_, i) => ({
      mon: month,
      day: prevMonth - startDay + i + 1,
      disabled:
        !dateFilter?.(
          new Date(year, month - 1, prevMonth - startDay + i + 1),
        ) || false,
      current: false,
    }));
    const t = daysArrayPrev.concat(daysArray); // Padding for start day alignment
    // get the additional days from the next month to fill the last row
    // we need to check whether it is divisible by 7 and we have to fill only the remaining days
    const remaining = t.length % 7 === 0 ? 0 : 7 - (t.length % 7);
    const daysArrayNext = Array.from({ length: remaining }, (_, i) => ({
      mon: month + 2,
      day: i + 1,
      disabled: !dateFilter?.(new Date(year, month + 1, i + 1)) || false,
      current: false,
    }));
    t.push(...daysArrayNext);
    return t;
  });

  todayDay = computed(() => {
    const today = new Date();
    return this.getSelectedDayOfMonth(today);
  });

  selectedDay = computed(() => {
    const today = this.datePicker.currentDate();
    return this.getSelectedDayOfMonth(today);
  });

  private getSelectedDayOfMonth(date: Date) {
    const r =
      this.cSelectedMonth() === date.getMonth() &&
      this.cSelectedYear() === date.getFullYear()
        ? date.getDate()
        : 0;
    return r;
  }

  selectDate(day: number) {
    const date = new Date(this.cSelectedYear(), this.cSelectedMonth(), day);
    this.datePicker.selectDate(date);
  }

  navigate(direction: number) {
    let selectedYear = this.datePicker.selectedYear();
    let selectedMonth = this.datePicker.selectedMonth();
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

    this.datePicker.selectedYear.set(selectedYear);
    this.datePicker.selectedMonth.set(selectedMonth);
  }

  getYears(year: number) {
    return Array.from({ length: 24 }, (_, i) => year - (24 - 6) + i);
  }

  selectYear(year: number) {
    this.datePicker.selectYear(year);
  }

  selectMonth(month: any) {
    this.datePicker.selectMonth(month.value, this.cSelectedYear());
  }

  toggleView() {
    this.datePicker.toggleView();
  }
}
