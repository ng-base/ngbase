import { Directive } from '@angular/core';
import { MeeRow } from '@meeui/adk/table';

@Directive({
  selector: '[meeRow]',
  hostDirectives: [{ directive: MeeRow, inputs: ['meeRow'] }],
})
export class Row {}
