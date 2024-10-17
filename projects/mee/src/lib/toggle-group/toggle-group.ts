import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { ToggleItem } from './toggle-item';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AccessibleGroup } from '../a11y/accessiblity-group';
import { generateId } from '../utils';

@Component({
  selector: 'mee-toggle-group',
  standalone: true,
  imports: [AccessibleGroup],
  template: `<div
    class="flex gap-1"
    meeAccessibleGroup
    [ayId]="ayId"
    [ariaLabel]="ariaLabel()"
    [ariaLabelledby]="ariaLabelledby()"
  >
    <ng-content select="[meeToggleItem]"></ng-content>
  </div>`,
  host: {
    class: '',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroup),
      multi: true,
    },
  ],
})
export class ToggleGroup<T> implements ControlValueAccessor {
  readonly multiple = input(true);
  readonly toggleItems = contentChildren(ToggleItem);
  readonly ayId = generateId();
  // value can be array or single value
  readonly value = model<T | T[]>();
  onChange = (value: any) => {};
  onTouched = () => {};

  readonly disabled = model(false);
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');

  constructor() {
    effect(
      () => {
        const items = this.toggleItems();
        items.forEach(radio => {
          radio.updateValue = () => {
            this.updateValue([radio.value()]);
          };
        });
      },
      { allowSignalWrites: true },
    );
  }

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
