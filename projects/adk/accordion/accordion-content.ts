import { Directive, inject } from '@angular/core';
import { MeeAccordion } from './accordion-item';

@Directive({
  selector: '[meeAccordionContent]',
  host: {
    role: 'region',
    '[id]': 'accordion.id',
    '[attr.aria-labelledby]': "'accordion-' + accordion.id",
  },
})
export class MeeAccordionContent {
  readonly accordion = inject(MeeAccordion);
}
