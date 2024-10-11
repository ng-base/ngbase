import { Directive, inject, input } from '@angular/core';
import { Menu } from './menu.component';
import { popoverPortal } from '../popover';
import { generateId } from '../utils';
import { DOCUMENT } from '@angular/common';
import { MenuService } from './menu.service';

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
  readonly menuService = inject(MenuService);

  readonly ayId = generateId();

  open(ev: MouseEvent) {
    console.log('open', ev);
    ev.preventDefault();
    ev.stopPropagation();
    const menu = this.meeContextMenu();
    const { diaRef } = this.popover.open(menu.container(), {
      target: ev.target as HTMLElement,
      position: 'bl',
      offset: 0,
      client: { x: ev.clientX, y: ev.clientY, w: 1, h: 1 },
      maxHeight: '400px',
      ayId: this.ayId,
      backdrop: false,
    });
    menu.diaRef = diaRef;
    menu.opened();
    this.menuService.setCurrentRef(diaRef);
    this.document.addEventListener('pointerup', this.clickOutside);
  }

  private clickOutside = () => {
    this.menuService.close();
    this.document.removeEventListener('pointerup', this.clickOutside);
  };
}
