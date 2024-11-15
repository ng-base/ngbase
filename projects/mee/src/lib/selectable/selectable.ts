import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AccessibleGroup } from '@meeui/ui/a11y';
import { provideValueAccessor, uniqueId } from '@meeui/ui/utils';

@Component({
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-bt p-b0.5',
    role: 'tablist',
  },
  hostDirectives: [AccessibleGroup],
  providers: [provideValueAccessor(Selectable)],
})
export class Selectable<T> implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  activeIndex = model<T>();
  valueChanged = output<T>();
  onChange = (_: T) => {};
  onTouched = () => {};
  readonly ayId = uniqueId();

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
