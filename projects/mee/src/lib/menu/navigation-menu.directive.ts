import { Directive, contentChildren, effect, inject, input } from '@angular/core';
import { MenuTrigger } from './menu-trigger.directive';
import { basePopoverPortal } from '../popover/base-popover.service';
import { Popover, PopoverOpen } from '../popover';
import { generateId } from '../utils';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[meeNavigationMenu]',
})
export class NavigationMenu {
  private popover = basePopoverPortal(Popover);
  private document = inject(DOCUMENT);
  private readonly menus = contentChildren(MenuTrigger, { descendants: true });

  readonly hover = input<boolean>(false);

  private ayId = generateId();
  close?: VoidFunction;
  private timerId: any = 0;
  private popoverOpen?: PopoverOpen<any>;
  private clicked = false;
  private currentEl?: MenuTrigger;

  constructor() {
    this.document.addEventListener('click', () => {
      if (this.close) {
        this.clicked = false;
        this.currentEl = undefined;
        this.close();
      }
    });
    effect(
      cleanup => {
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
      },
      { allowSignalWrites: true },
    );
  }

  open(menuTrigger: MenuTrigger) {
    clearTimeout(this.timerId);
    const menu = menuTrigger.meeMenuTrigger();
    const target = menuTrigger.el.nativeElement;
    if (this.close) {
      // console.log('navigation menu open existing', menu);
      this.popoverOpen?.replace?.(menu.container()!);
      this.popoverOpen?.parent.target?.set(target);
      menu.diaRef = this.popoverOpen!.diaRef;
      // We need to change the id so that new menu items gets registered for a11y
      menu.diaRef.options.ayId = generateId();
      menu.opened();
      return;
    }
    // console.log('navigation menu open');

    this.popoverOpen = this.popover.open(
      menu.container()!,
      { target, position: 'bl', className: 'transition-all' },
      { ayId: this.ayId, backdrop: false },
    );
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
