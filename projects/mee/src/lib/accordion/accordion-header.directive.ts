import { Directive, inject } from '@angular/core';
import { Accordion } from './accordion-item.component';

@Directive({
  standalone: true,
  selector: '[meeAccordionHeader]',
  host: {
    class: 'flex items-center w-full py-b3 px-b3',
    '[class]': `accordion.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'`,
    '(click)': 'accordion.disabled() ? null : accordion.toggle()',
    '[tabindex]': 'accordion.disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'accordion.disabled()',
    '[attr.aria-expanded]': 'accordion.expanded()',
    '[attr.aria-controls]': 'accordion.id',
    '[id]': `'accordion-' + accordion.id`,
  },
})
export class AccordionHeader {
  accordion = inject(Accordion);
}
