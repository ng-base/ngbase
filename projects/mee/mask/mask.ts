import { Directive } from '@angular/core';
import { Mask } from '@ngbase/adk/mask';

@Directive({
  selector: '[meeMask]',
  hostDirectives: [{ directive: Mask, inputs: ['ngbMask: meeMask', 'showMaskType'] }],
})
export class MaskInput {}
