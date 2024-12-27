import { Directive } from '@angular/core';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Directive({
  selector: '[meeInputStyle]',
  host: {
    class: 'inline-block rounded-base bg-foreground px-3 py-b2 border font-normal',
  },
  hostDirectives: [{ directive: FocusStyle, inputs: ['unfocus'] }],
})
export class InputStyle {}
