import { contentChildren, Directive, forwardRef, inject, model } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { provideValueAccessor, uniqueId } from '@ngbase/adk/utils';
import { NgbRadio } from './radio';

@Directive({
  selector: '[ngbRadioGroup]',
  host: {
    class: 'ngb-radio-group',
    role: 'radiogroup',
  },
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(NgbRadioGroup)],
})
export class NgbRadioGroup implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  readonly radios = contentChildren(
    forwardRef(() => NgbRadio),
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
