import { Directive } from '@angular/core';
import { InputStyle } from './public-api';

@Directive({
  selector: '[meeInputPrefix]',
  hostDirectives: [InputStyle],
})
export class InputPrefix {}
