import {
  ChangeDetectionStrategy,
  Component,
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
    role: 'tablist'
  },
})
export class Selectable {
  items = contentChildren(SelectableItem);
  activeIndex = model(0);
  valueChanged = output<number>();

  constructor() {
    effect(
      () => {
        const items = this.items();

        items.forEach((item, index) => {
          item.selected.update(() => index === this.activeIndex());
        });
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        this.valueChanged.emit(this.activeIndex());
      },
      { allowSignalWrites: true },
    );
  }
}
