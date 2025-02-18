import { Directive } from '@angular/core';
import { Mask } from '@meeui/adk/mask';

@Directive({
  selector: '[meeMask]',
  hostDirectives: [{ directive: Mask, inputs: ['meeMask', 'showMaskType'] }],
})
export class MaskInput {}
