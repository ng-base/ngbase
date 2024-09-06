import { Directive, inject, input } from '@angular/core';
import { Menu } from './menu.component';
import { popoverPortal } from '../popover';
import { generateId } from '../utils';
import { Keys } from '../keys';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[meeContextMenu]',
  host: {
    '(contextmenu)': 'open($event)',
  },
})
export class ContextMenu {
  readonly meeContextMenu = input.required<Menu>();
  readonly popover = popoverPortal();
  readonly document = inject(DOCUMENT);

  readonly ayId = generateId();
  close: VoidFunction = () => {};
  readonly keys = new Keys();
  private currentMouseEvent: MouseEvent | null = null;

  constructor() {
    this.document.addEventListener('mousemove', ev => {
      this.currentMouseEvent = ev;
    });

    this.keys.event('ContextMenu').subscribe(([active, ev]) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (active) {
        this.open(this.currentMouseEvent!);
      }
    });
  }

  open(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const menu = this.meeContextMenu();
    const { diaRef } = this.popover.open(
      menu.container(),
      {
        target: ev.target as HTMLElement,
        position: 'bl',
        offset: 0,
        client: { x: ev.clientX, y: ev.clientY, w: 1, h: 1 },
      },
      {
        maxHeight: '400px',
        ayId: this.ayId,
      },
    );
    menu.diaRef = diaRef;
    menu.opened();
    this.close = diaRef.close;
  }
}
