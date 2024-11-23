import { Directive } from '@angular/core';
import { MeeInputError } from '@meeui/adk/input';

@Directive({
  selector: '[meeError]',
  host: {
    class: 'text-red-500 mx-b0.5',
  },
  hostDirectives: [{ directive: MeeInputError, inputs: ['meeError'] }],
})
export class InputError {}
