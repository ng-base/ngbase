import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, inject } from '@angular/core';
import {
  DatepickerGroup,
  NgbDatePicker,
  NgbDatepickerTrigger,
  NgbEndDate,
  aliasDatePicker,
  aliasDatePickerTrigger,
  registerDatePicker,
} from '@ngbase/adk/datepicker';
import { RangePipe } from '@ngbase/adk/utils';
import { Calendar } from './calendar';

@Component({
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasDatePicker(DatePicker)],
  imports: [Calendar, RangePipe, NgTemplateOutlet, DatepickerGroup],
  template: `
    <div class="flex" ngbDatepickerGroup>
      @for (no of noOfCalendar() | range; track no) {
        <mee-calendar [first]="$first" [last]="$last" [index]="$index" />
      }
    </div>
    @if (template()) {
      <div class="px-2 pb-2">
        <ng-container *ngTemplateOutlet="template(); injector: injector" />
      </div>
    }
  `,
  host: {
    class: 'inline-block',
  },
})
export class DatePicker<D> extends NgbDatePicker<D> {}

@Directive({
  selector: '[meeDatepickerTrigger]',
  exportAs: 'meeDatepickerTrigger',
  providers: [registerDatePicker(DatePicker), aliasDatePickerTrigger(DatepickerTrigger)],
  host: {
    class: 'cursor-pointer hover:bg-muted outline-none w-full bg-transparent',
  },
})
export class DatepickerTrigger<D> extends NgbDatepickerTrigger<D> {}

@Directive({
  selector: '[meeEndDate]',
  hostDirectives: [{ directive: NgbEndDate, inputs: ['ngbEndDate: meeEndDate'] }],
  host: {
    class: 'hidden',
  },
})
export class EndDate {
  constructor() {
    inject(NgbEndDate).hidden = true;
  }
}
