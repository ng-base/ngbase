import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@meeui/adk/utils';
import { NumberOnly, padString } from './number-only';

@Directive({
  selector: '[meeTimeInput]',
  hostDirectives: [{ directive: NumberOnly, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    type: 'tel',
  },
})
export class MeeTimeInput {
  readonly numberOnly = inject(NumberOnly);
  readonly timePicker = inject(MeeTimePicker);

  readonly meeTimeInput = input.required<'hours' | 'minutes' | 'seconds'>();

  constructor() {
    this.numberOnly._min.set(0);
    this.numberOnly._len.set(2);
    effect(() => {
      const type = this.meeTimeInput();
      if (type === 'hours') {
        this.numberOnly._max.set(this.timePicker.is24() ? 23 : 11);
      } else {
        this.numberOnly._max.set(59);
      }
    });
  }
}

@Component({
  selector: '[meeTime]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(MeeTimePicker)],
  imports: [NumberOnly, MeeTimeInput],
  template: `
    <input meeTimeInput="hours" [(value)]="hours" (valueChange)="updateValue()" />
    <span>:</span>
    <input meeTimeInput="minutes" [(value)]="minutes" (valueChange)="updateValue()" />
    <span>:</span>
    <input meeTimeInput="seconds" [(value)]="seconds" (valueChange)="updateValue()" />
    @if (!is24()) {
      <div class="ml-b flex gap-b2">
        <button type="button" class="small" (click)="changeAm(true)">AM</button>
        <button type="button" class="small" (click)="changeAm(false)">PM</button>
      </div>
    }
  `,
  host: {
    class: 'inline-flex gap-b items-center justify-center',
  },
})
export class MeeTimePicker implements ControlValueAccessor {
  readonly is24 = input(false);
  readonly value = input<string | null | undefined>();
  readonly valueChange = output<string | null | undefined>();
  private time = computed(() => {
    return (
      `${padString(this.hours())}:${padString(this.minutes())}:${padString(this.seconds())}` +
      (!this.is24() ? ` ${this.am() ? 'AM' : 'PM'}` : '')
    );
  });
  readonly hours = signal('00');
  readonly minutes = signal('00');
  readonly seconds = signal('00');
  readonly am = signal(true);

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => {
        this.parseValue(value);
      });
    });
  }

  private parseValue(value: string | null | undefined) {
    if (value) {
      const [time, period] = value.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      const am = period === 'AM';

      this.hours.set(padString(hours));
      this.minutes.set(padString(minutes));
      this.seconds.set(padString(seconds));
      this.am.set(am);
    }
  }

  changeAm(active: boolean) {
    this.am.set(active);
    this.updateValue();
  }

  updateValue() {
    this.notify(this.time());
  }

  private notify(time: string) {
    this.valueChange.emit(time);
    this.onChange(time);
    this.onTouched();
  }

  writeValue(value: string) {
    if (value) {
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

function _provide(picker: typeof MeeTimePicker) {
  return [provideValueAccessor(picker)];
}

export function provideTimePicker(picker: typeof MeeTimePicker) {
  return [_provide(picker), { provide: MeeTimePicker, useExisting: picker }];
}
