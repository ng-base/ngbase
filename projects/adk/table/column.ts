import { Directive, input, contentChild, TemplateRef } from '@angular/core';
import { MeeCellDef } from './body-cell';
import { MeeHeadDef } from './head-cell';

@Directive({
  selector: '[meeRow]',
})
export class MeeRow {
  readonly meeRow = input.required<string>();
  readonly cells = contentChild(MeeCellDef, { read: TemplateRef });
  readonly heads = contentChild(MeeHeadDef, { read: TemplateRef });
}
