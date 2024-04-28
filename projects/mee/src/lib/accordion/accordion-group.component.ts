import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { AccordionItem } from './accordion-item.component';
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
  items = contentChildren(AccordionItem);
  accordionService = inject(AccordionService);
  multiple = input(false);

  constructor() {
    effect(
      () => {
        const items = this.items();
        const active = this.accordionService.active();
        const isMultiple = this.multiple();
        if (!isMultiple) {
          items.forEach((item) => {
            item.active.set(item.id === active);
          });
        }
      },
      { allowSignalWrites: true },
    );
  }
}
