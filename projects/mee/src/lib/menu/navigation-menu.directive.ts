import { Directive, contentChildren, effect, input } from '@angular/core';
import { MenuTrigger } from './menu-trigger.directive';
import { basePopoverPortal } from '../popover/base-popover.service';
import { Popover, PopoverOpen } from '../popover';
import { merge, Subscription } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[meeNavigationMenu]',
})
export class NavigationMenu {
  private popover = basePopoverPortal(Popover);
  menus = contentChildren(MenuTrigger, { descendants: true });
  hover = input<boolean>(false);
  close?: VoidFunction;
  private timerId: any = 0;
  popoverOpen?: PopoverOpen<any>;
  private sub?: Subscription;
  private clicked = false;

  constructor() {
    let currentEl: HTMLElement;

    effect(
      () => {
        const menus = this.menus();
        this.sub?.unsubscribe();
        this.sub = merge(...menus.map(menu => menu.events)).subscribe(({ event, type, menu }) => {
          // console.log(type, this.clicked && type === 'enter');
          // if (
          //   (this.clicked && type === 'enter') ||
          //   (!this.clicked && type === 'click')
          // ) {
          if (type === 'enter') {
            currentEl = event.target as HTMLElement;
            this.clicked = true;
            this.open(menu);
          } else if (currentEl === event.target) {
            this.scheduleClose();
          }
        });
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
      return;
    }
    // console.log('navigation menu open');

    this.popoverOpen = this.popover.open(
      menu.container()!,
      { target, position: 'bl', className: 'transition-all' },
      { maxHeight: '400px', width: '200px', backdrop: false },
    );
    menu.diaRef = this.popoverOpen.diaRef;
    this.popoverOpen.events.subscribe(e => {
      if (e.type === 'mouseenter') {
        clearTimeout(this.timerId);
      } else {
        this.scheduleClose();
      }
    });
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
      this.close?.();
    }, 200);
  }
}
