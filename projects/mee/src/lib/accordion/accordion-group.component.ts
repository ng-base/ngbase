import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { Accordion } from './accordion-item.component';
import { AccordionService } from './accordion.service';

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
  providers: [AccordionService],
})
export class AccordionGroup {
  items = contentChildren(Accordion);
  accordionService = inject(AccordionService);
  multi = input(false);

  constructor() {
    effect(
      () => {
        const items = this.items();
        const active = this.accordionService.activeId();
        const isMultiple = this.multi();
        if (!isMultiple) {
          items.forEach((item) => {
            item.expanded.set(item.id === active);
          });
        }
      },
      { allowSignalWrites: true },
    );
  }
}
