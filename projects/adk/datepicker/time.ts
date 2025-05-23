import {
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
import { NumberOnly, padString, provideValueAccessor } from '@ngbase/adk/utils';

@Directive({
  selector: '[ngbTimeInput]',
  hostDirectives: [{ directive: NumberOnly, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    type: 'tel',
  },
})
export class NgbTimeInput {
  readonly numberOnly = inject(NumberOnly);
  readonly timePicker = inject(NgbTimePicker);

  readonly ngbTimeInput = input.required<'hours' | 'minutes' | 'seconds'>();

  constructor() {
    this.numberOnly._min.set(0);
    this.numberOnly._len.set(2);
    effect(() => {
      const type = this.ngbTimeInput();
      if (type === 'hours') {
        this.numberOnly._max.set(this.timePicker.is24() ? 23 : 11);
      } else {
        this.numberOnly._max.set(59);
      }
    });
  }
}

@Directive({
  selector: '[ngbTime]',
  providers: [_provide(NgbTimePicker)],
})
export class NgbTimePicker implements ControlValueAccessor {
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
      const [hours, minutes, seconds = '00'] = time.split(':');
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

function _provide(picker: typeof NgbTimePicker) {
  return [provideValueAccessor(picker)];
}

export function aliasTimePicker(picker: typeof NgbTimePicker) {
  return [_provide(picker), { provide: NgbTimePicker, useExisting: picker }];
}
