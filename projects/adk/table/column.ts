import { Directive, input, contentChild, TemplateRef } from '@angular/core';
import { MeeCellDef } from './body-cell';
import { MeeHeadDef } from './head-cell';

@Directive({
  selector: '[meeColumn]',
})
export class MeeColumn {
  readonly meeColumn = input.required<string>();
  readonly sticky = input<'start' | 'end' | ''>('');
  readonly cells = contentChild(MeeCellDef, { read: TemplateRef });
  readonly heads = contentChild(MeeHeadDef, { read: TemplateRef });
}
