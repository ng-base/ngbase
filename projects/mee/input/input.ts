import { Directive } from '@angular/core';
import { InputStyle } from './input-style.directive';
import { InputBase } from '@meeui/adk/input';

@Directive({
  selector: '[meeInput]',
  host: {
    class: 'focus:outline-none',
    '[class.border-red-500]': 'formField?.hasErrors()',
  },
  hostDirectives: [{ directive: InputBase, inputs: ['value'] }, InputStyle],
})
export class Input<T = unknown> {}
