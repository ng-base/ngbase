import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  DatepickerGroup,
  NgbDatePicker,
  NgbDatepickerTrigger,
  aliasDatePicker,
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
        <ng-container *ngTemplateOutlet="template()" />
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
  providers: [registerDatePicker(DatePicker)],
  hostDirectives: [
    {
      directive: NgbDatepickerTrigger,
      inputs: [
        'noOfCalendars',
        'range',
        'time',
        'format',
        'fieldFormat',
        'dateFilter',
        'pickerType',
        'pickerTemplate',
      ],
    },
  ],
  host: {
    class: 'cursor-pointer hover:bg-muted-background outline-none',
  },
})
export class DatepickerTrigger<D> {}
