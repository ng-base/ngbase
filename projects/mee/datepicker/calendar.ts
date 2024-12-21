import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CalendarBtn,
  CalendarDayBtn,
  CalendarMonthBtn,
  CalendarTitle,
  CalendarYearBtn,
  MeeCalendar,
  provideCalendar,
} from '@meeui/adk/datepicker';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { TimePicker } from './time';

@Component({
  selector: 'mee-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCalendar(Calendar)],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  imports: [
    NgClass,
    Button,
    Icon,
    TimePicker,
    CalendarBtn,
    CalendarTitle,
    CalendarYearBtn,
    CalendarMonthBtn,
    CalendarDayBtn,
  ],
  template: `
    <div class="mb-b2 flex items-center justify-between">
      <button meeCalendarBtn="left" meeButton="outline" class="h-b6 w-b6 rounded-md !px-0">
        <mee-icon [name]="dir.isRtl() ? 'lucideChevronRight' : 'lucideChevronLeft'" />
      </button>
      <button meeCalendarTitle meeButton="ghost" class="small rounded-md">
        {{ title() }}
      </button>
      <button meeCalendarBtn="right" meeButton="outline" class="h-b6 w-b6 rounded-md !px-0">
        <mee-icon [name]="dir.isRtl() ? 'lucideChevronLeft' : 'lucideChevronRight'" />
      </button>
    </div>

    @if (datePicker.showType() === 'year') {
      <div class="grid grid-cols-3">
        @for (year of years(); track year.year) {
          <button
            [meeCalYearBtn]="year"
            #yearBtn="meeCalYearBtn"
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
            [meeCalMonthBtn]="month"
            #monthBtn="meeCalMonthBtn"
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
            #days="meeCalDayBtn"
            [meeCalDayBtn]="day"
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
        <mee-time class="mt-b5 w-full" [(value)]="time1" (valueChange)="timeChanged(0, time1()!)" />
        <mee-time class="mt-b5 w-full" [(value)]="time2" (valueChange)="timeChanged(1, time2()!)" />
      }
    }
  `,
  host: {
    class: 'inline-flex flex-col min-h-[18.75rem] p-b2 w-full',
  },
})
export class Calendar<D> extends MeeCalendar<D> {}
