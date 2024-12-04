import { Directive, inject, Injectable, input, output } from '@angular/core';
import { DialogRef } from '@meeui/adk/portal';
import { documentListener, uniqueId } from '@meeui/adk/utils';
import { popoverPortal } from '@meeui/adk/popover';
import { Menu } from './menu';

@Injectable({ providedIn: 'root' })
class MenuService {
  private currentRef: DialogRef<any> | null = null;

  close() {
    this.currentRef?.close();
    this.currentRef = null;
  }

  setCurrentRef(ref: DialogRef<any>) {
    this.close();
    this.currentRef = ref;
  }
}

@Directive({
  selector: '[meeContextMenu]',
  host: {
    '(contextmenu)': 'open($event)',
  },
})
export class ContextMenu {
  readonly meeContextMenu = input.required<Menu>();
  readonly popover = popoverPortal();
  readonly menuService = inject(MenuService);
  readonly ctxOpen = output<boolean>();
  readonly ctxClose = output<boolean>();

  readonly ayId = uniqueId();

  private docListner = documentListener('pointerup', () => this.menuService.close(), {
    once: true,
    lazy: true,
  });

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
    this.ctxOpen.emit(true);
    this.menuService.setCurrentRef(diaRef);
    menu.diaRef.afterClosed.subscribe(() => {
      this.ctxClose.emit(true);
    });
    this.docListner.on();
  }
}
