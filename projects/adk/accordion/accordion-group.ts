import { booleanAttribute, contentChildren, Directive, effect, input, signal } from '@angular/core';
import { NgbAccordion } from './accordion-item';

@Directive({
  selector: '[ngbAccordionGroup]',
  exportAs: 'ngbAccordionGroup',
})
export class NgbAccordionGroup {
  readonly items = contentChildren(NgbAccordion);
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
