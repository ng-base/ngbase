import { Directive } from '@angular/core';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Directive({
  selector: '[meeInputStyle]',
  hostDirectives: [{ directive: FocusStyle, inputs: ['unfocus'] }],
  host: {
    class: 'inline-block rounded-base bg-foreground px-3 py-b2 border font-normal min-h-10',
  },
})
export class InputStyle {}
