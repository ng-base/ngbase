import { NgClass } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-date-picker',
  imports: [NgClass],
  template: `
    <div class="header">
      <button
        class="rounded-md px-3 py-1 hover:bg-lighter"
        (click)="navigate(-1)"
      >
        &#60;
      </button>
      <button
        class="rounded-md px-3 py-1 hover:bg-lighter"
        (click)="toggleView()"
      >
        {{ title() }}
      </button>
      <button
        class="rounded-md px-3 py-1 hover:bg-lighter"
        (click)="navigate(1)"
      >
        &#62;
      </button>
    </div>

    @if (showType() === 'year') {
      <div class="years">
        @for (year of years; track year) {
          <button
            class="items-center justify-center rounded-md py-2  hover:bg-lighter"
            (click)="selectYear(year)"
            [class]="
              selectedYear() === year ? 'border border-border bg-lighter' : ''
            "
          >
            {{ year }}
          </button>
        }
      </div>
    } @else if (showType() === 'month') {
      <div class="months">
        @for (month of months; track month.value) {
          <button
            class="items-center justify-center rounded-md py-2  hover:bg-lighter"
            (click)="selectMonth(month)"
            [class]="
              selectedMonth() === month.value
                ? 'border border-border bg-lighter'
                : ''
            "
          >
            {{ month.name }}
          </button>
        }
      </div>
    } @else {
      <div class="day-names">
        @for (dayName of dayNames; track dayName) {
          <div class="p-1">{{ dayName }}</div>
        }
      </div>
      <div class="days">
        @for (day of getDaysArray(); track $index) {
          <button
            (click)="selectDate(day.day)"
            class="day flex h-8 w-8 items-center justify-center rounded-md hover:bg-lighter"
            [ngClass]="{
              'border border-border bg-lighter': day.day === todayDay(),
              'text-gray-400': day.mon !== selectedMonth() + 1
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'inline-block min-h-[18.75rem] w-60 p-2',
  },
  styles: `
    .day-names {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      font-weight: bold;
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
export class DatePickerComponent {
  showType = signal<'days' | 'month' | 'year'>('days');
  readonly selectedDate = signal(new Date());
  readonly selectedMonth = signal(this.selectedDate().getMonth());
  readonly selectedYear = signal(this.selectedDate().getFullYear());
  readonly selectedMonthName = computed(() => {
    const date = new Date(this.selectedYear(), this.selectedMonth());
    return date.toLocaleString('default', { month: 'long' });
  });
  years = this.getYears(this.selectedYear());
  readonly months = Array.from({ length: 12 }, (_, i) => {
    const name = new Date(0, i).toLocaleString('default', { month: 'long' });
    return { name: name.substring(0, 3), value: i };
  });
  readonly title = computed(() => {
    const type = this.showType();
    const month = this.selectedMonthName();
    const year = this.selectedYear();
    const r =
      type === 'year' ? year : type === 'month' ? year : month + ' ' + year;
    return r;
  });
  readonly dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  getDaysArray = computed(() => {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    const numDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numDays }, (_, i) => ({
      mon: month + 1,
      day: i + 1,
    }));
    const startDay = new Date(year, month).getDay();
    // get the additional days from the previous month
    const prevMonth = new Date(year, month, 0).getDate();
    const daysArrayPrev = Array.from({ length: startDay }, (_, i) => ({
      mon: month,
      day: prevMonth - startDay + i + 1,
    }));
    const t = daysArrayPrev.concat(daysArray); // Padding for start day alignment
    // get the additional days from the next month to fill the last row
    // we need to check whether it is divisible by 7 and we have to fill only the remaining days
    const remaining = t.length % 7 === 0 ? 0 : 7 - (t.length % 7);
    const daysArrayNext = Array.from({ length: remaining }, (_, i) => ({
      mon: month + 2,
      day: i + 1,
    }));
    t.push(...daysArrayNext);
    return t;
  });

  todayDay = computed(() => {
    const today = new Date();
    const r =
      this.selectedMonth() === today.getMonth() &&
      this.selectedYear() === today.getFullYear()
        ? today.getDate()
        : -1;
    return r;
  });

  selectDate(day: number) {
    this.selectedDate.set(
      new Date(this.selectedYear(), this.selectedMonth(), day),
    );
  }

  navigate(direction: number) {
    let selectedYear = this.selectedYear();
    let selectedMonth = this.selectedMonth();
    const type = this.showType();
    if (type === 'year') {
      selectedYear += direction * 24;
      this.years = this.getYears(selectedYear);
    } else if (type === 'month') {
      selectedYear += direction;
    } else {
      selectedMonth += direction;
      if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
      } else if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
      }
    }

    this.selectedYear.set(selectedYear);
    this.selectedMonth.set(selectedMonth);
  }

  getYears(year: number) {
    return Array.from({ length: 24 }, (_, i) => year - (24 - 6) + i);
  }

  selectYear(year: number) {
    this.selectedYear.set(year);
    this.showType.set('month');
  }

  selectMonth(month: any) {
    this.selectedMonth.set(month.value);
    this.showType.set('days');
  }

  toggleView() {
    let type = this.showType();
    if (type === 'days') {
      type = 'month';
    } else if (type === 'month') {
      type = 'year';
    } else {
      type = 'days';
    }
    this.showType.set(type);
  }
}
