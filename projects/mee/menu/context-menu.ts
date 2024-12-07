import { Directive } from '@angular/core';
import { MeeContextMenu } from '@meeui/adk/menu';

@Directive({
  selector: '[meeContextMenu]',
  hostDirectives: [
    { directive: MeeContextMenu, inputs: ['meeContextMenu'], outputs: ['ctxOpen', 'ctxClose'] },
  ],
})
export class ContextMenu {}
