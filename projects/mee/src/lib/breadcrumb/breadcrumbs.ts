import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  Directive,
  effect,
  TemplateRef,
} from '@angular/core';
import { Breadcrumb } from './breadcrumb';

@Directive({
  standalone: true,
  selector: '[meeBreadcrumbsSeparator]',
})
export class BreadcrumbsSeparator {}

@Component({
  standalone: true,
  selector: 'mee-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'flex items-center gap-b2',
    'aria-label': 'breadcrumb',
  },
})
export class Breadcrumbs {
  items = contentChildren(Breadcrumb);
  separator = contentChild(BreadcrumbsSeparator, { read: TemplateRef });

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
