import { Directive } from '@angular/core';
import { MeeListActionGroup } from '@meeui/adk/list';

@Directive({
  selector: '[meeActionGroup]',
  hostDirectives: [MeeListActionGroup],
})
export class ListActionGroup {}
