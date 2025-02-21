import { Directive } from '@angular/core';
import { NgbContextMenu } from '@ngbase/adk/menu';

@Directive({
  selector: '[meeContextMenu]',
  hostDirectives: [
    {
      directive: NgbContextMenu,
      inputs: ['ngbContextMenu: meeContextMenu'],
      outputs: ['ctxOpen', 'ctxClose'],
    },
  ],
})
export class ContextMenu {}
