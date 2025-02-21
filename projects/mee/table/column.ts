import { Directive } from '@angular/core';
import { NgbColumn } from '@ngbase/adk/table';

@Directive({
  selector: '[meeColumn]',
  hostDirectives: [{ directive: NgbColumn, inputs: ['ngbColumn: meeColumn', 'sticky'] }],
})
export class Column {}
