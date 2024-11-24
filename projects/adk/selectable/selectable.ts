import { Directive, inject, model, output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { provideValueAccessor, uniqueId } from '@meeui/adk/utils';

@Directive({
  selector: '[meeSelectable]',
  host: {
    role: 'tablist',
  },
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(MeeSelectable)],
})
export class MeeSelectable<T> implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);

  readonly activeIndex = model<T>();
  readonly valueChanged = output<T>();

  readonly ayId = uniqueId();
  onChange = (_: T) => {};
  onTouched = () => {};

  constructor() {
    this.allyGroup.ayId.set(this.ayId);
    this.allyGroup.clickable.set(true);
  }

  setValue(value: T) {
    this.activeIndex.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueChanged.emit(value);
  }

  writeValue(v: T): void {
    this.activeIndex.set(v);
  }

  registerOnChange(fn: (v: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
