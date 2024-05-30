import { Directive, input } from '@angular/core';
import { Menu } from './menu.component';
import { popoverPortal } from '../popover';

@Directive({
  standalone: true,
  selector: '[meeContextMenu]',
  host: {
    '(contextmenu)': 'open($event)',
  },
})
export class ContextMenu {
  meeContextMenu = input.required<Menu>();
  popover = popoverPortal();
  close: VoidFunction = () => {};

  open(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const menu = this.meeContextMenu();
    const { diaRef } = this.popover.open(
      menu.container()!,
      {
        target: ev.target as HTMLElement,
        position: 'bl',
        offset: 0,
        client: { x: ev.clientX, y: ev.clientY, w: 1, h: 1 },
      },
      { maxHeight: '400px' },
    );
    menu.diaRef = diaRef;
    this.close = diaRef.close;
  }
}
