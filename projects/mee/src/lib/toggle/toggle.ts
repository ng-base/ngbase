import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { provideValueAccessor } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'button[meeToggle]',
  template: `<ng-content />`,
  host: {
    class: 'block w-9 h-9 rounded relative',
    '[class.bg-background]': 'value',
    '(click)': 'toggle()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(Toggle)],
})
export class Toggle implements ControlValueAccessor {
  value = false;
  onChange = (_: boolean) => {};
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
