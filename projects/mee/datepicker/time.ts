import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbTimeInput, NgbTimePicker, aliasTimePicker } from '@ngbase/adk/datepicker';
import { Button } from '@meeui/ui/button';

@Component({
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTimePicker(TimePicker)],
  imports: [Button, NgbTimeInput],
  template: `
    <input
      ngbTimeInput="hours"
      [(value)]="hours"
      (valueChange)="updateValue()"
      class="w-7 px-1 text-center font-semibold outline-none focus:bg-muted"
    />
    <span>:</span>
    <input
      ngbTimeInput="minutes"
      [(value)]="minutes"
      (valueChange)="updateValue()"
      class="w-7 px-1 text-center font-semibold outline-none focus:bg-muted"
    />
    <span>:</span>
    <input
      ngbTimeInput="seconds"
      [(value)]="seconds"
      (valueChange)="updateValue()"
      class="w-7 px-1 text-center font-semibold outline-none focus:bg-muted"
    />
    @if (!is24()) {
      <div class="ml-1 flex gap-2">
        <button
          [meeButton]="am() ? 'primary' : 'ghost'"
          class="small !px-1 !py-0"
          (click)="changeAm(true)"
        >
          AM
        </button>
        <button
          [meeButton]="!am() ? 'primary' : 'ghost'"
          class="small !px-1 !py-0"
          (click)="changeAm(false)"
        >
          PM
        </button>
      </div>
    }
  `,
  host: {
    class: 'inline-flex gap-1 items-center justify-center',
  },
})
export class TimePicker extends NgbTimePicker {}
