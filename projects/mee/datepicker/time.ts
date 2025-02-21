import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbTimeInput, NgbTimePicker, provideTimePicker } from '@ngbase/adk/datepicker';
import { Button } from '@meeui/ui/button';

@Component({
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTimePicker(TimePicker)],
  imports: [Button, NgbTimeInput],
  template: `
    <input
      ngbTimeInput="hours"
      [(value)]="hours"
      (valueChange)="updateValue()"
      class="w-7 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      ngbTimeInput="minutes"
      [(value)]="minutes"
      (valueChange)="updateValue()"
      class="w-7 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      ngbTimeInput="seconds"
      [(value)]="seconds"
      (valueChange)="updateValue()"
      class="w-7 px-b text-center font-semibold focus:bg-muted-background"
    />
    @if (!is24()) {
      <div class="ml-b flex gap-b2">
        <button [meeButton]="am() ? 'primary' : 'ghost'" class="small" (click)="changeAm(true)">
          AM
        </button>
        <button [meeButton]="!am() ? 'primary' : 'ghost'" class="small" (click)="changeAm(false)">
          PM
        </button>
      </div>
    }
  `,
  host: {
    class: 'inline-flex gap-b items-center justify-center',
  },
})
export class TimePicker extends NgbTimePicker {}
