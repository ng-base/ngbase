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
import { Directionality } from '@ngbase/adk/bidi';
import { provideValueAccessor, uniqueId } from '@ngbase/adk/utils';

@Directive({
  selector: 'button[ngbSwitchTrack]',
  exportAs: 'ngbSwitchTrack',
  host: {
    type: 'button',
    role: 'switch',
    '[id]': 'switch.id',
    '(click)': 'switch.updateValue()',
    '[disabled]': 'switch.disabled()',
    '[attr.aria-checked]': 'checked()',
  },
})
export class NgbSwitchTrack {
  readonly switch = inject(NgbSwitch);
  readonly checked = computed(() => this.switch.checked());
}

@Directive({
  selector: '[ngbSwitchThumb]',
  exportAs: 'ngbSwitchThumb',
  host: {
    '[attr.aria-checked]': 'checked()',
  },
})
export class NgbSwitchThumb {
  readonly switch = inject(NgbSwitch);
  private readonly dir = inject(Directionality);
  readonly checked = computed(() => this.switch.checked());
  readonly rtl = this.dir.isRtl;
}

@Directive({
  selector: '[ngbSwitchLabel]',
  host: {
    '[attr.for]': 'switch.id',
  },
})
export class NgbSwitchLabel {
  readonly switch = inject(NgbSwitch);
}

@Directive({
  selector: '[ngbSwitch]',
  exportAs: 'ngbSwitch',
  providers: [_provide(NgbSwitch)],
})
export class NgbSwitch implements ControlValueAccessor {
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

function _provide(ngbSwitch: typeof NgbSwitch) {
  return [provideValueAccessor(ngbSwitch)];
}

export function provideSwitch(ngbSwitch: Type<NgbSwitch>) {
  return [_provide(ngbSwitch), { provide: NgbSwitch, useExisting: ngbSwitch }];
}
