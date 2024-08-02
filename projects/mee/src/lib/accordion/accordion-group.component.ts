import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import { Accordion } from './accordion-item.component';

@Component({
  standalone: true,
  selector: 'mee-accordion-group',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AccordionGroup {
  items = contentChildren(Accordion);
  multiple = input(false, { transform: booleanAttribute });
  activeId = signal('');

  constructor() {
    effect(
      () => {
        const items = this.items();
        const id = this.activeId();
        const isMultiple = this.multiple();
        if (!isMultiple) {
          items.forEach(item => {
            item.expanded.set(item.id === id);
          });
        }
      },
      { allowSignalWrites: true },
    );
  }
}
