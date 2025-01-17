import { Directive } from '@angular/core';
import { Mask } from '@meeui/adk/mask';
import { InputStyle } from '@meeui/ui/form-field';

@Directive({
  selector: '[meeMask]',
  hostDirectives: [InputStyle, { directive: Mask, inputs: ['meeMask', 'showMaskType'] }],
})
export class MaskInput {}
