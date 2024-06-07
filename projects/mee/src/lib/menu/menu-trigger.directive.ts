import {
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { popoverPortal } from '../popover';
import { Menu } from './menu.component';
import { NavigationMenu } from './navigation-menu.directive';
import { Subject } from 'rxjs';
import { DialogOptions } from '../portal';

@Directive({
  standalone: true,
  selector: '[meeMenuTrigger]',
  host: {
    '(click)': 'clickOpen($event)',
  },
})
export class MenuTrigger {
  meeMenuTrigger = input.required<Menu>();
  hover = inject(NavigationMenu, { optional: true });
  options = input<DialogOptions>({});
  private parent = inject(Menu, { optional: true });
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  private popover = popoverPortal();
  close: VoidFunction | null = null;
  private closeParent = true;
  private delayTimer: any = 0;
  events = new Subject<{
    event: MouseEvent;
    type: 'enter' | 'leave' | 'click';
    menu: MenuTrigger;
  }>();

  constructor() {
    afterNextRender(() => {
      // if parent is provided, then this is a sub-menu and we should open on mouseenter and close on mouseleave
      if (this.parent || this.hover) {
        this.el.nativeElement.addEventListener('mouseenter', (ev) => {
          this.events.next({ event: ev, type: 'enter', menu: this });
          if (this.hover) {
            return;
          }
          clearTimeout(this.delayTimer);
          console.log('mouseenter');
          this.open(ev);
        });
        this.el.nativeElement.addEventListener('mouseleave', (ev) => {
          this.events.next({ event: ev, type: 'leave', menu: this });
          if (this.hover) {
            return;
          }
          // only close when x is not same for the el
          const el = this.el.nativeElement.getBoundingClientRect();
          const y = ev.clientY;
          console.log(y, el.top, el.height);
          if (!(y > el.top && y < el.top + el.height) || this.hover) {
            if (this.hover) {
              this.delayTimer = setTimeout(() => {
                this.closeParent = false;
                this.close?.();
              }, 300);
            } else {
              this.closeParent = false;
              this.close?.();
            }
          }
        });
      }
    });
  }

  clickOpen(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.hover) {
      this.events.next({ event: ev, type: 'click', menu: this });
      return;
    } else {
      this.open(ev);
    }
  }

  open(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.close) {
      return;
    }
    console.log('open menu', this.parent);
    const menu = this.meeMenuTrigger();
    const { diaRef, events } = this.popover.open(
      menu.container()!,
      {
        target: this.el.nativeElement,
        position: this.parent ? 'right' : 'bl',
        offset: 4,
      },
      { maxHeight: '400px', backdrop: !this.parent, ...this.options() },
    );
    menu.diaRef = diaRef;
    menu.opened();
    this.close = () => {
      menu.close();
      this.close = null;
    };
    if (this.hover) {
      events.subscribe((ev) => {
        if (ev.type === 'mouseleave') {
          this.delayTimer = setTimeout(() => {
            this.closeParent = false;
            this.close?.();
          }, 300);
        } else {
          clearTimeout(this.delayTimer);
        }
      });
    }
    menu.diaRef?.afterClosed.subscribe(() => {
      if (this.closeParent && this.parent) {
        this.parent?.close();
      }
      this.close = null;
    });
    if (this.parent) {
      this.parent.diaRef?.afterClosed.subscribe(() => {
        this.close?.();
      });
    }
  }
}
