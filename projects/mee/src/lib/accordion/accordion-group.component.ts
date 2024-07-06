import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Accordion } from './accordion-item.component';

@Component({
  standalone: true,
  selector: 'mee-accordion-group',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply block;
    }
  `,
})
export class AccordionGroup {
  items = contentChildren(Accordion);
  multi = input(false);

  constructor() {
    effect(
      () => {
        const items = this.items();
        const active = items.find(item => item.expanded())?.id;
        const isMultiple = this.multi();
        if (!isMultiple) {
          items.forEach(item => {
            item.expanded.set(item.id === active);
          });
        }
      },
      { allowSignalWrites: true },
    );
  }
}
