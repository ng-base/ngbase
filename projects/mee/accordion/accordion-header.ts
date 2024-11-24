import { Directive, inject } from '@angular/core';
import { MeeAccordion, MeeAccordionHeader } from '@meeui/adk/accordion';

@Directive({
  selector: '[meeAccordionHeader]',
  host: {
    class: 'flex items-center w-full py-b3 px-b3',
    '[class]': `accordion.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'`,
  },
  hostDirectives: [MeeAccordionHeader],
})
export class AccordionHeader {
  readonly accordion = inject(MeeAccordion);
}
