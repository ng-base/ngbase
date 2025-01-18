import { Directive, inject, Injectable, input, output } from '@angular/core';
import { DialogRef } from '@meeui/adk/portal';
import { documentListener } from '@meeui/adk/utils';
import { MeeMenu } from './menu';

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
export class MeeContextMenu {
  readonly meeContextMenu = input.required<MeeMenu>();
  readonly menuService = inject(MenuService);

  readonly ctxOpen = output<boolean>();
  readonly ctxClose = output<boolean>();

  private listeners = (() => {
    const ev = ['click', 'contextmenu'].map(ev =>
      documentListener(ev, () => this.menuService.close(), { once: true, lazy: true }),
    );
    return { on: () => ev.forEach(e => e.on()), off: () => ev.forEach(e => e.off()) };
  })();

  open(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const menu = this.meeContextMenu();
    menu.open({
      target: ev.target as HTMLElement,
      client: { x: ev.clientX, y: ev.clientY, w: 1, h: 1 },
      maxHeight: '400px',
      backdrop: false,
      offset: 0,
    });
    this.ctxOpen.emit(true);
    this.menuService.setCurrentRef(menu.diaRef);
    menu.diaRef.afterClosed.subscribe(() => {
      this.ctxClose.emit(true);
      this.listeners.off();
    });
    this.listeners.on();
  }
}
