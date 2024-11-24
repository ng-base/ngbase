import { booleanAttribute, contentChildren, Directive, effect, input, signal } from '@angular/core';
import { MeeAccordion } from './accordion-item';

@Directive({
  selector: '[meeAccordionGroup]',
  exportAs: 'meeAccordionGroup',
})
export class MeeAccordionGroup {
  readonly items = contentChildren(MeeAccordion);
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
