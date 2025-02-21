import { Directive, inject } from '@angular/core';
import { NgbAccordion } from './accordion-item';

@Directive({
  selector: '[ngbAccordionHeader]',
  host: {
    '(click)': 'accordion.disabled() ? null : accordion.toggle()',
    '[tabindex]': 'accordion.disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'accordion.disabled()',
    '[attr.aria-expanded]': 'accordion.expanded()',
    '[attr.aria-controls]': 'accordion.id',
    '[id]': `'accordion-' + accordion.id`,
  },
})
export class NgbAccordionHeader {
  accordion = inject(NgbAccordion);
}
