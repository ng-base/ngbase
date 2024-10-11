import { Component, contentChildren, forwardRef, inject, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Radio } from './radio.component';
import { AccessibleGroup } from '../a11y';
import { generateId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-radio-group',
  imports: [FormsModule],
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex gap-b2',
    role: 'radiogroup',
  },
  hostDirectives: [AccessibleGroup],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
})
export class RadioGroup implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  readonly radios = contentChildren(Radio, { descendants: true });
  readonly value = model<any>('');
  readonly ayId = generateId();
  onChange?: (value: any) => {};
  onTouched?: () => {};

  constructor() {
    this.allyGroup.ayId.set(this.ayId);
    this.allyGroup.clickable.set(true);
  }

  updateValue(value: any) {
    this.value.set(value);
    this.onChange?.(value);
    this.onTouched?.();
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
}
