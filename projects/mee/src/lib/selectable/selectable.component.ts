import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  contentChildren,
  effect,
  forwardRef,
  model,
  output,
} from '@angular/core';
import { SelectableItem } from './selectable-item.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-base p-b',
    role: 'tablist',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Selectable),
      multi: true,
    },
  ],
})
export class Selectable<T> implements ControlValueAccessor {
  items: Signal<readonly SelectableItem<T>[]> = contentChildren(SelectableItem);
  activeIndex = model<T>();
  valueChanged = output<T>();
  onChange = (value: T) => {};
  onTouched = () => {};

  constructor() {
    effect(
      () => {
        const items = this.items();

        items.forEach((item, index) => {
          item.selected.update(() => item.value() === this.activeIndex());
          item.select = () => {
            this.setValue(item.value());
          };
        });
      },
      { allowSignalWrites: true },
    );
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
