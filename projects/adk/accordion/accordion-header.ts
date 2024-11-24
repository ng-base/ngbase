import { Directive, inject } from '@angular/core';
import { MeeAccordion } from './accordion-item';

@Directive({
  selector: '[meeAccordionHeader]',
  host: {
    '(click)': 'accordion.disabled() ? null : accordion.toggle()',
    '[tabindex]': 'accordion.disabled() ? -1 : 0',
    '[attr.aria-disabled]': 'accordion.disabled()',
    '[attr.aria-expanded]': 'accordion.expanded()',
    '[attr.aria-controls]': 'accordion.id',
    '[id]': `'accordion-' + accordion.id`,
  },
})
export class MeeAccordionHeader {
  accordion = inject(MeeAccordion);
}
