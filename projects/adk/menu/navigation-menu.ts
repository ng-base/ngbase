import { Directive, contentChildren, effect, input } from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';
import { PopoverOpen, meePopoverPortal } from '@meeui/adk/popover';
import { documentListener, uniqueId } from '@meeui/adk/utils';
import { MeeMenuTrigger } from './menu-trigger';

@Directive({
  selector: '[meeNavigationMenu]',
})
export class MeeNavigationMenu {
  private popover = meePopoverPortal();
  private readonly dir = injectDirectionality();
  private readonly menus = contentChildren(MeeMenuTrigger, { descendants: true });

  readonly hover = input<boolean>(false);

  private ayId = uniqueId();
  close?: VoidFunction;
  private timerId: any = 0;
  private popoverOpen?: PopoverOpen<any>;
  private clicked = false;
  private currentEl?: MeeMenuTrigger;

  constructor() {
    documentListener('click', () => {
      if (this.close) {
        this.clicked = false;
        this.currentEl = undefined;
        this.close();
      }
    });
    effect(cleanup => {
      const menus = this.menus();
      const hover = this.hover();
      const sub = menus.map(menu =>
        menu.events.subscribe(({ type, menu }) => {
          const isSame = this.currentEl === menu;
          if (
            (type === 'enter' && (hover || this.clicked)) ||
            (type === 'click' && !hover && !isSame)
          ) {
            this.clicked = true;
            this.currentEl = menu;
            this.open(menu);
          } else if (isSame && (hover || type === 'click')) {
            this.scheduleClose();
          }
        }),
      );
      cleanup(() => sub.forEach(x => x.unsubscribe()));
    });
  }

  open(menuTrigger: MeeMenuTrigger) {
    clearTimeout(this.timerId);
    const menu = menuTrigger.meeMenuTrigger();
    const target = menuTrigger.el.nativeElement;
    if (this.close) {
      // console.log('navigation menu open existing', menu);
      this.popoverOpen?.replace?.(menu.container()!);
      this.popoverOpen?.parent.target?.set(target);
      menu.diaRef = this.popoverOpen!.diaRef;
      // We need to change the id so that new menu items gets registered for a11y
      menu.diaRef.options.ayId = uniqueId();
      menu.opened();
      return;
    }
    // console.log('navigation menu open');

    this.popoverOpen = this.popover.open(menu.container()!, {
      target,
      position: this.dir.isRtl() ? 'br' : 'bl',
      className: 'transition-all',
      ayId: this.ayId,
      backdrop: false,
    });
    menu.diaRef = this.popoverOpen.diaRef;
    if (this.hover()) {
      this.popoverOpen.events.subscribe(e => {
        if (e.type === 'mouseenter') {
          clearTimeout(this.timerId);
        } else {
          this.scheduleClose();
        }
      });
    }
    menu.opened();
    this.close = () => {
      menu.close();
      this.close = undefined;
      this.popoverOpen = undefined;
    };
  }

  private scheduleClose() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.clicked = false;
      this.currentEl = undefined;
      this.close?.();
    }, 200);
  }
}
