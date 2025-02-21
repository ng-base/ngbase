import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatepickerGroup, NgbDatePicker, provideDatePicker } from '@ngbase/adk/datepicker';
import { RangePipe } from '@ngbase/adk/utils';
import { Calendar } from './calendar';

@Component({
  selector: 'mee-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDatePicker(DatePicker)],
  imports: [Calendar, RangePipe, NgTemplateOutlet, DatepickerGroup],
  template: `
    <div class="flex" ngbDatepickerGroup>
      @for (no of noOfCalendar() | range; track no) {
        <mee-calendar [first]="$first" [last]="$last" [index]="$index" />
      }
    </div>
    @if (template()) {
      <div class="px-b2 pb-b2">
        <ng-container *ngTemplateOutlet="template()" />
      </div>
    }
  `,
  host: {
    class: 'inline-block',
  },
})
export class DatePicker<D> extends NgbDatePicker<D> {}
