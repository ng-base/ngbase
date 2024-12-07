import { Directive } from '@angular/core';
import { MeeMenuTrigger } from '@meeui/adk/menu';

@Directive({
  selector: '[meeMenuTrigger]',
  hostDirectives: [
    { directive: MeeMenuTrigger, inputs: ['meeMenuTrigger', 'meeMenuTriggerData', 'options'] },
  ],
})
export class MenuTrigger {}
