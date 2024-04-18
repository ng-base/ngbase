import {
  Component,
  OnInit,
  contentChildren,
  effect,
  inject,
} from '@angular/core';
import { AccordionItem } from './accordion-item.component';
import { AccordionService } from './accordion.service';

@Component({
  standalone: true,
  selector: 'mee-accordion-group',
  template: `<ng-content></ng-content>`,
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

  constructor() {
    effect(() => {
      const items = this.items();
      const active = this.accordionService.active();
      items.forEach((item) => {
        item.active = item.id === active;
      });
    });
  }
}
