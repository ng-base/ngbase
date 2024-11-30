import { contentChildren, Directive, forwardRef, inject, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { provideValueAccessor, uniqueId } from '@meeui/adk/utils';
import { MeeRadio } from './radio';

@Directive({
  selector: '[meeRadioGroup]',
  host: {
    class: 'mee-radio-group',
    role: 'radiogroup',
  },
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(MeeRadioGroup)],
})
export class MeeRadioGroup implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  readonly radios = contentChildren(
    forwardRef(() => MeeRadio),
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
