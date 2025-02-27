import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatepickerGroup, NgbDatePicker, aliasDatePicker } from '@ngbase/adk/datepicker';
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
