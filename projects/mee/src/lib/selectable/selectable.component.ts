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
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    class: 'inline-flex relative bg-background rounded-base p-1',
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
