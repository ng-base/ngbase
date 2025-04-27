import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import {
  CalendarBtn,
  CalendarDayBtn,
  CalendarMonthBtn,
  CalendarTitle,
  CalendarYearBtn,
  NgbCalendar,
  aliasCalendar,
} from '@ngbase/adk/datepicker';
import { TimePicker } from './time';

@Component({
  selector: 'mee-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasCalendar(Calendar)],
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
    <div class="mb-2 flex items-center justify-between">
      <button ngbCalendarBtn="left" meeButton="outline" class="h-6 w-6 rounded-md !px-0">
        <mee-icon [name]="dir.isRtl() ? 'lucideChevronRight' : 'lucideChevronLeft'" />
      </button>
      <button ngbCalendarTitle meeButton="ghost" class="small rounded-md">
        {{ title() }}
      </button>
      <button ngbCalendarBtn="right" meeButton="outline" class="h-6 w-6 rounded-md !px-0">
        <mee-icon [name]="dir.isRtl() ? 'lucideChevronLeft' : 'lucideChevronRight'" />
      </button>
    </div>

    @if (datePicker.showType() === 'year') {
      <div class="grid grid-cols-3">
        @for (year of years(); track year.year) {
          <button
            [ngbCalYearBtn]="year"
            #yearBtn="ngbCalYearBtn"
            class="items-center justify-center rounded-md py-2 h-9 w-[84px] {{
              year.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted'
            }}"
            [ngClass]="{
              'border bg-muted': yearBtn.selected(),
              '!bg-primary text-background': yearBtn.active(),
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
            class="items-center justify-center rounded-md py-2 h-9 w-[84px] {{
              month.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted'
            }}"
            [ngClass]="{
              'border bg-muted': monthBtn.selected(),
              '!bg-primary text-background': monthBtn.active(),
            }"
          >
            {{ month.name }}
          </button>
        }
      </div>
    } @else {
      <div class="day-names grid grid-cols-7">
        @for (dayName of dayNames; track dayName) {
          <div class="text-muted-foreground p-1 text-center">{{ dayName }}</div>
        }
      </div>
      <div class="grid grid-cols-7 gap-y-2">
        @for (day of getDaysArray(); track day.day + '-' + day.mon) {
          <button
            #days="ngbCalDayBtn"
            [ngbCalDayBtn]="day"
            class="mx-auto flex h-9 w-9 items-center justify-center text-center {{
              day.disabled ? 'cursor-default opacity-50' : 'hover:bg-muted'
            }}"
            [ngClass]="{
              'bg-muted': days.selected(),
              'opacity-40': days.dummy(),
              '!bg-primary text-background': days.active(),
            }"
          >
            {{ day.day }}
          </button>
        }
      </div>
      @if (datePicker.time() && datePicker.range()) {
        <mee-time class="mt-5 w-full" [(value)]="time1" (valueChange)="timeChanged(0, time1()!)" />
        <mee-time class="mt-5 w-full" [(value)]="time2" (valueChange)="timeChanged(1, time2()!)" />
      }
    }
  `,
  host: {
    class: 'inline-flex flex-col min-h-[18.75rem] p-2 w-full',
  },
})
export class Calendar<D> extends NgbCalendar<D> {}
