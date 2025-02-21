import { Directive, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@ngbase/adk/utils';

@Directive({
  selector: 'button[ngbToggle]',
  providers: [provideValueAccessor(NgbToggle)],
  host: {
    '(click)': 'toggle()',
    '[attr.aria-pressed]': 'value()',
  },
})
export class NgbToggle implements ControlValueAccessor {
  value = model(false);
  onChange = (_: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  toggle() {
    this.value.update(v => !v);
    this.onChange(this.value());
  }
}
