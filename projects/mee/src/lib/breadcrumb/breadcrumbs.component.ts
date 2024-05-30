import { Component, contentChildren, effect } from '@angular/core';
import { Breadcrumb } from './breadcrumb.component';

@Component({
  selector: 'mee-breadcrumbs',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex items-center space-x-h',
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
