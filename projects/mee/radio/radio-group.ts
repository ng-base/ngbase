import { Component, contentChildren, forwardRef, inject, model } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { provideValueAccessor, uniqueId } from '@meeui/adk/utils';
import { Radio } from './radio';

@Component({
  standalone: true,
  selector: 'mee-radio-group',
  imports: [FormsModule],
  template: `<ng-content />`,
  host: {
    class: 'flex gap-b2',
    role: 'radiogroup',
  },
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(RadioGroup)],
})
export class RadioGroup implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  readonly radios = contentChildren(
    forwardRef(() => Radio),
    { descendants: true },
  );
  readonly value = model<any>('');
  readonly ayId = uniqueId();
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
