import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { InputStyle } from '../input/input-style.directive';
import { NumberOnly, padString } from './number-only.directive';
import { Button } from '../button';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputStyle, NumberOnly, Button, FormsModule],
  template: `
    <input
      meeInputStyle
      meeNumberOnly
      (valueChanged)="hours.set($event)"
      [min]="0"
      [max]="is24() ? 23 : 11"
      [len]="2"
      [(ngModel)]="hours"
      class="w-10 px-b text-center font-semibold"
    />
    <span>:</span>
    <input
      meeInputStyle
      meeNumberOnly
      (valueChanged)="minutes.set($event)"
      [min]="0"
      [max]="59"
      [len]="2"
      [(ngModel)]="minutes"
      class="w-10 px-b text-center font-semibold"
    />
    @if (!is24()) {
      <div class="ml-b flex gap-b2">
        <button
          type="button"
          meeButton
          [variant]="am() ? 'primary' : 'ghost'"
          class="small"
          (click)="changeAm(true)"
        >
          AM
        </button>
        <button
          type="button"
          meeButton
          [variant]="!am() ? 'primary' : 'ghost'"
          class="small"
          (click)="changeAm(false)"
        >
          PM
        </button>
      </div>
    }
  `,
  host: {
    class: 'inline-flex gap-b items-center justify-center',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePicker),
      multi: true,
    },
  ],
})
export class TimePicker implements ControlValueAccessor {
  readonly hours = signal('00');
  readonly minutes = signal('00');
  readonly am = signal(true);
  readonly is24 = input(false);
  readonly valueChange = output<string>();
  time = this.updateValue(this.hours(), this.minutes(), this.am(), false);

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    effect(
      () => {
        const hours = this.hours();
        const minutes = this.minutes();
        const am = this.am();
        this.updateValue(hours, minutes, am);
      },
      { allowSignalWrites: true },
    );
  }

  changeAm(active: boolean) {
    this.am.set(active);
  }

  updateValue(hours: string, minutes: string, am: boolean, notify = true) {
    const time =
      `${padString(hours)}:${padString(minutes)}` + (!this.is24() ? ` ${am ? 'AM' : 'PM'}` : '');
    if (notify) {
      this.notify(time);
    }
    this.time = time;
    return time;
  }

  notify(time: string) {
    if (this.time !== time) {
      this.onChange(time);
      this.onTouched();
      this.valueChange.emit(time);
    }
  }

  writeValue(value: string) {
    if (value) {
      const [time, period] = value.split(' ');
      const [hours, minutes] = time.split(':');
      this.hours.set(padString(hours));
      this.minutes.set(padString(minutes));
      this.am.set(period === 'AM');
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
