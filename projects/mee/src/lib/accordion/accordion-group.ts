import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import { Accordion } from './accordion-item';

@Component({
  selector: 'mee-accordion-group',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AccordionGroup {
  readonly items = contentChildren(Accordion);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly activeId = signal('');

  constructor() {
    effect(() => {
      const items = this.items();
      const ids = this.activeId();
      const isMultiple = this.multiple();
      if (!isMultiple) {
        items.forEach(item => {
          item.expanded.set(ids.includes(item.id));
        });
      }
    });
  }
}
