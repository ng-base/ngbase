import { ChangeDetectionStrategy, Component, contentChildren, input, model } from '@angular/core';
import { ToggleItem } from './toggle-item';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '../a11y/accessiblity-group';
import { provideValueAccessor, uniqueId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-toggle-group',
  imports: [AccessibleGroup],
  template: `<div
    class="flex gap-1"
    meeAccessibleGroup
    [ayId]="ayId"
    [ariaLabel]="ariaLabel()"
    [ariaLabelledby]="ariaLabelledby()"
  >
    <ng-content select="[meeToggleItem]" />
  </div>`,
  host: {
    class: '',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(ToggleGroup)],
})
export class ToggleGroup<T> implements ControlValueAccessor {
  readonly multiple = input(true);
  readonly toggleItems = contentChildren(ToggleItem);
  readonly ayId = uniqueId();
  // value can be array or single value
  readonly value = model<T | T[]>();
  onChange = (value: any) => {};
  onTouched = () => {};

  readonly disabled = model(false);
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');

  updateValue(value: T[]) {
    let values = this.value();
    if (this.multiple()) {
      values = values as T[];
      for (const val of value) {
        if (values.includes(val)) {
          values = values.filter(v => v !== val);
        } else {
          values = [...values, val];
        }
      }
    } else {
      values = value;
    }
    this.value.set(values);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
