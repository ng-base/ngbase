import { Directive, inject } from '@angular/core';
import { Accordion } from './accordion-item.component';

@Directive({
  standalone: true,
  selector: '[meeAccordionHeader]',
  host: {
    class: 'flex items-center w-full cursor-pointer py-b3 px-b3',
    '(click)': 'accordion.toggle()',
  },
})
export class AccordionHeader {
  accordion = inject(Accordion);
}
