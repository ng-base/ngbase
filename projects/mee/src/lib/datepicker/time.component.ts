import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { InputStyle } from '../input/input-style.directive';
import { NumberOnly, padString } from './number-only.directive';
import { Button } from '../button';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

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
      class="w-10 px-b2 text-center font-semibold"
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
      class="w-10 px-b2 text-center font-semibold"
    />
    @if (!is24()) {
      <div class="flex gap-b2">
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
    class: 'inline-flex gap-b2 items-center',
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
  hours = signal('00');
  minutes = signal('00');
  am = signal(true);
  is24 = input(false);

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
    effect(() => {
      const hours = this.hours();
      const minutes = this.minutes();
      const am = this.am();
      this.updateValue(hours, minutes, am);
    });
  }

  changeAm(active: boolean) {
    this.am.set(active);
  }

  updateValue(hours: string, minutes: string, am: boolean) {
    // making it two digits
    let time = `${padString(hours)}:${padString(minutes)}`;
    if (!this.is24()) {
      time += ` ${am ? 'AM' : 'PM'}`;
    }
    this.onChange(time);
    this.onTouched();
  }

  setValues(hours: number, minutes: number) {
    this.hours.set(padString(hours));
    this.minutes.set(padString(minutes));
  }

  writeValue(value: string) {
    const splits = value?.split(':');
    if (splits?.length === 2) {
      const [hours, minutes] = splits[0].split(':');
      this.setValues(+hours, +minutes);
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
