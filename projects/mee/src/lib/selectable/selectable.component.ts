import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  contentChildren,
  effect,
  forwardRef,
  inject,
  model,
  output,
} from '@angular/core';
import { SelectableItem } from './selectable-item.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AccessibleGroup } from '../a11y';
import { generateId } from '../utils';

@Component({
  standalone: true,
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccessibleGroup],
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-bt p-b',
    role: 'tablist',
  },
  hostDirectives: [AccessibleGroup],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Selectable),
      multi: true,
    },
  ],
})
export class Selectable<T> implements ControlValueAccessor {
  readonly allyGroup = inject(AccessibleGroup);
  items: Signal<readonly SelectableItem<T>[]> = contentChildren(SelectableItem);
  activeIndex = model<T>();
  valueChanged = output<T>();
  onChange = (value: T) => {};
  onTouched = () => {};
  readonly ayId = generateId();

  constructor() {
    this.allyGroup.ayId.set(this.ayId);
    this.allyGroup.clickable.set(true);
    effect(
      () => {
        const items = this.items();

        items.forEach((item, index) => {
          item.selected.update(() => item.value() === this.activeIndex());
          item.allyItem.ayId.set(this.ayId);
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
