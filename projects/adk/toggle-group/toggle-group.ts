import {
  booleanAttribute,
  contentChildren,
  Directive,
  inject,
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { provideValueAccessor, uniqueId } from '@ngbase/adk/utils';
import { NgbToggleItem } from './toggle-item';

@Directive({
  selector: '[ngbToggleGroup]',
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(NgbToggleGroup)],
  host: {
    role: 'group',
  },
})
export class NgbToggleGroup<T> implements ControlValueAccessor {
  readonly accessibleGroup = inject(AccessibleGroup);
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly toggleItems = contentChildren(NgbToggleItem);
  readonly ayId = uniqueId();
  // value can be array or single value
  readonly value = model<T | T[]>();
  onChange = (_: any) => {};
  onTouched = () => {};

  readonly disabled = model(false);
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');

  constructor() {
    this.accessibleGroup._ayId.set(this.ayId);
    this.accessibleGroup._ariaLabel = linkedSignal(this.ariaLabel);
    this.accessibleGroup._ariaLabelledby = linkedSignal(this.ariaLabelledby);
  }

  updateValue(value: T[]) {
    let values = this.value();
    if (this.multiple()) {
      values = (values as T[]) || [];
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
