import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTimeInput, MeeTimePicker, provideTimePicker } from '@meeui/adk/datepicker';
import { Button } from '@meeui/ui/button';

@Component({
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTimePicker(TimePicker)],
  imports: [Button, MeeTimeInput],
  template: `
    <input
      meeTimeInput="hours"
      [(value)]="hours"
      (valueChange)="updateValue()"
      class="w-7 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      meeTimeInput="minutes"
      [(value)]="minutes"
      (valueChange)="updateValue()"
      class="w-7 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      meeTimeInput="seconds"
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
export class TimePicker extends MeeTimePicker {}
