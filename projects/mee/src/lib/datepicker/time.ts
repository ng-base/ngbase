import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  untracked,
} from '@angular/core';
import { InputStyle } from '../input/input-style.directive';
import { NumberOnly, padString } from './number-only';
import { Button } from '../button';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'mee-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputStyle, NumberOnly, Button],
  template: `
    <input
      type="tel"
      meeInputStyle
      meeNumberOnly
      [value]="hours"
      (valueChange)="hours = $event; updateValue()"
      [min]="0"
      [max]="is24() ? 23 : 11"
      [len]="2"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      type="tel"
      meeInputStyle
      meeNumberOnly
      [value]="minutes"
      (valueChange)="minutes = $event; updateValue()"
      [min]="0"
      [max]="59"
      [len]="2"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
    />
    <span>:</span>
    <input
      type="tel"
      meeInputStyle
      meeNumberOnly
      [value]="seconds"
      (valueChange)="seconds = $event; updateValue()"
      [min]="0"
      [max]="59"
      [len]="2"
      class="w-10 px-b text-center font-semibold focus:bg-muted-background"
    />
    @if (!is24()) {
      <div class="ml-b flex gap-b2">
        <button
          type="button"
          meeButton
          [variant]="am ? 'primary' : 'ghost'"
          class="small"
          (click)="changeAm(true)"
        >
          AM
        </button>
        <button
          type="button"
          meeButton
          [variant]="!am ? 'primary' : 'ghost'"
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
  providers: [provideValueAccessor(TimePicker)],
})
export class TimePicker implements ControlValueAccessor {
  readonly is24 = input(false);
  readonly value = input<string | null | undefined>();
  readonly valueChange = output<string | null | undefined>();
  private time = '';
  hours = '00';
  minutes = '00';
  seconds = '00';
  am = true;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => {
        console.log('value', value);
        this.parseValue(value);
      });
    });
  }

  private parseValue(value: string | null | undefined) {
    if (value) {
      const [time, period] = value.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      const am = period === 'AM';

      this.hours = padString(hours);
      this.minutes = padString(minutes);
      this.seconds = padString(seconds);
      this.am = am;

      this.updateValue();
    }
  }

  changeAm(active: boolean) {
    this.am = active;
    this.updateValue();
  }

  updateValue() {
    // console.log(this.hours);
    const time =
      `${padString(this.hours)}:${padString(this.minutes)}:${padString(this.seconds)}` +
      (!this.is24() ? ` ${this.am ? 'AM' : 'PM'}` : '');
    if (this.time !== time) {
      // console.log('notify', time);
      this.notify(time);
      this.time = time;
    }
  }

  private notify(time: string) {
    this.valueChange.emit(time);
    this.onChange(time);
    this.onTouched();
  }

  writeValue(value: string) {
    if (value) {
      // console.log('writeValue', value);
      this.time = value;
      this.parseValue(value);
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
