import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  contentChildren,
  effect,
  model,
  output,
  signal,
} from '@angular/core';
import { SelectableItem } from './selectable-item.component';

@Component({
  standalone: true,
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-base p-b',
    role: 'tablist',
  },
})
export class Selectable<T> {
  items: Signal<readonly SelectableItem<T>[]> = contentChildren(SelectableItem);
  activeIndex = model<T>();
  valueChanged = output<T>();

  constructor() {
    effect(
      () => {
        const items = this.items();

        items.forEach((item, index) => {
          item.selected.update(() => item.value() === this.activeIndex());
        });
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        this.valueChanged.emit(this.activeIndex()!);
      },
      { allowSignalWrites: true },
    );
  }
}
