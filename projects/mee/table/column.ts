import { Directive } from '@angular/core';
import { MeeColumn } from '@meeui/adk/table';

@Directive({
  selector: '[meeColumn]',
  hostDirectives: [{ directive: MeeColumn, inputs: ['meeColumn', 'sticky'] }],
})
export class Column {}
