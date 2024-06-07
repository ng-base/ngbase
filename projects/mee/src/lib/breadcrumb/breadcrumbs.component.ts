import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
} from '@angular/core';
import { Breadcrumb } from './breadcrumb.component';

@Component({
  standalone: true,
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex items-center space-x-b2',
    'aria-label': 'breadcrumb',
  },
})
export class Breadcrumbs {
  items = contentChildren(Breadcrumb);

  constructor() {
    effect(
      () => {
        const items = this.items() || [];
        items.forEach((item, i) => {
          item.active.set(i === items.length - 1);
        });
      },
      { allowSignalWrites: true },
    );
  }
}
