import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'button[meeToggle]',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    class: 'block w-9 h-9 rounded relative',
    '[class.bg-background]': 'value',
    '(click)': 'toggle()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
  ],
})
export class Toggle implements ControlValueAccessor {
  value = false;
  onChange = (value: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  toggle() {
    this.value = !this.value;
    this.onChange(this.value);
  }
}
