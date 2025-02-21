import { Directive } from '@angular/core';
import { NgbHoverCard } from '@ngbase/adk/hover-card';

@Directive({
  selector: '[meeHoverCard]',
  hostDirectives: [
    {
      directive: NgbHoverCard,
      inputs: ['ngbHoverCard: meeHoverCard', 'options', 'delay'],
    },
  ],
})
export class HoverCard<T = any> {}
