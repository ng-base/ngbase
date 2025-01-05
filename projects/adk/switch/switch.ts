import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  model,
  output,
  Type,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Directionality } from '@meeui/adk/bidi';
import { provideValueAccessor, uniqueId } from '@meeui/adk/utils';

@Directive({
  selector: 'button[meeSwitchTrack]',
  exportAs: 'meeSwitchTrack',
  host: {
    type: 'button',
    role: 'switch',
    '[id]': 'switch.id',
    '(click)': 'switch.updateValue()',
    '[disabled]': 'switch.disabled()',
    '[attr.aria-checked]': 'checked()',
  },
})
export class MeeSwitchTrack {
  readonly switch = inject(MeeSwitch);
  readonly checked = computed(() => this.switch.checked());
}

@Directive({
  selector: '[meeSwitchThumb]',
  exportAs: 'meeSwitchThumb',
  host: {
    '[attr.aria-checked]': 'checked()',
  },
})
export class MeeSwitchThumb {
  readonly switch = inject(MeeSwitch);
  private readonly dir = inject(Directionality);
  readonly checked = computed(() => this.switch.checked());
  readonly rtl = this.dir.isRtl;
}

@Directive({
  selector: '[meeSwitchLabel]',
  host: {
    '[attr.for]': 'switch.id',
  },
})
export class MeeSwitchLabel {
  readonly switch = inject(MeeSwitch);
}

@Directive({
  selector: '[meeSwitch]',
  exportAs: 'meeSwitch',
  providers: [_provide(MeeSwitch)],
})
export class MeeSwitch implements ControlValueAccessor {
  readonly id = uniqueId();
  readonly change = output<boolean>();
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  private onChange?: (value: any) => {};
  private onTouched?: () => {};

  updateValue() {
    this.checked.update(v => !v);
    const checked = this.checked();
    this.onChange?.(checked);
    this.onTouched?.();
    this.change.emit(checked);
  }

  writeValue(value: any): void {
    this.checked.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

function _provide(meeSwitch: typeof MeeSwitch) {
  return [provideValueAccessor(meeSwitch)];
}

export function provideSwitch(meeSwitch: Type<MeeSwitch>) {
  return [_provide(meeSwitch), { provide: MeeSwitch, useExisting: meeSwitch }];
}
