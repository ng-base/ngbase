import { Directive } from '@angular/core';
import { FocusStyle } from '../checkbox/focus-style.directive';

@Directive({
  standalone: true,
  selector: '[meeInputStyle]',
  host: {
    class: 'inline-block text-left rounded-base bg-foreground px-3 py-b2 border m-b0.5 font-normal',
  },
  hostDirectives: [{ directive: FocusStyle, inputs: ['unfocus'] }],
})
export class InputStyle {}
