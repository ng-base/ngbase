import { animate, state, style, transition, trigger } from '@angular/animations';
import { Directive, inject } from '@angular/core';
import { NgbAccordion } from './accordion-item';

@Directive({
  selector: '[ngbAccordionContent]',
  host: {
    role: 'region',
    '[id]': 'accordion.id',
    '[attr.aria-labelledby]': "'accordion-' + accordion.id",
  },
})
export class NgbAccordionContent {
  readonly accordion = inject(NgbAccordion);
}

export const slideAnimation = trigger('slide', [
  state('void', style({ height: '0', opacity: 0 })),
  state('*', style({ height: '*', opacity: 1 })),
  transition('void => *', animate('300ms ease')),
  transition('* => void', animate('300ms ease')),
]);
