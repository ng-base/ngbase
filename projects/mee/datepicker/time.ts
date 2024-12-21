import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTimeInput, MeeTimePicker, provideTimePicker } from '@meeui/adk/datepicker';
import { Button } from '@meeui/ui/button';
import { InputStyle } from '@meeui/ui/input';

@Component({
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTimePicker(TimePicker)],
  imports: [InputStyle, Button, MeeTimeInput],
  template: `
    <input
      meeInputStyle
      meeTimeInput="hours"
      [(value)]="hours"
      (valueChange)="updateValue()"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      meeInputStyle
      meeTimeInput="minutes"
      [(value)]="minutes"
      (valueChange)="updateValue()"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      meeInputStyle
      meeTimeInput="seconds"
      [(value)]="seconds"
      (valueChange)="updateValue()"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
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
