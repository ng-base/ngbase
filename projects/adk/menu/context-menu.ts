import { Directive, inject, Injectable, input, output } from '@angular/core';
import { DialogRef } from '@ngbase/adk/portal';
import { documentListener } from '@ngbase/adk/utils';
import { NgbMenu } from './menu';

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
  selector: '[ngbContextMenu]',
  host: {
    '(contextmenu)': 'open($event)',
  },
})
export class NgbContextMenu {
  readonly ngbContextMenu = input.required<NgbMenu>();
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
    const menu = this.ngbContextMenu();
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
