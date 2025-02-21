import { Directive, input, contentChild, TemplateRef } from '@angular/core';
import { NgbCellDef } from './body-cell';
import { NgbHeadDef } from './head-cell';

@Directive({
  selector: '[ngbColumn]',
})
export class NgbColumn {
  readonly ngbColumn = input.required<string>();
  readonly sticky = input<'start' | 'end' | ''>('');
  readonly cells = contentChild(NgbCellDef, { read: TemplateRef });
  readonly heads = contentChild(NgbHeadDef, { read: TemplateRef });
}
