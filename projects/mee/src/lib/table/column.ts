import { Directive, input, contentChild, TemplateRef } from '@angular/core';
import { CellDef } from './body-cell';
import { HeadDef } from './head-cell';

@Directive({
  standalone: true,
  selector: '[meeRow]',
})
export class Row {
  meeRow = input.required<string>();
  cells = contentChild(CellDef, { read: TemplateRef });
  heads = contentChild(HeadDef, { read: TemplateRef });
}
