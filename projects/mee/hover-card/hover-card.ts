import { Directive } from '@angular/core';
import { MeeHoverCard } from '@meeui/adk/hover-card';

@Directive({
  selector: '[meeHoverCard]',
  hostDirectives: [{ directive: MeeHoverCard, inputs: ['meeHoverCard', 'options', 'delay'] }],
})
export class HoverCard<T = any> {}
