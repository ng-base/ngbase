import { Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { meePopoverPortal } from '@meeui/adk/popover';
import { DialogOptions } from '@meeui/adk/portal';
import { uniqueId } from '@meeui/adk/utils';
import { Subject } from 'rxjs';
import { MeeMenu } from './menu';
import { MeeNavigationMenu } from './navigation-menu';

@Directive({
  selector: '[meeMenuTrigger]',
  exportAs: 'meeMenuTrigger',
  host: {
    '(click)': 'clickOpen($event)',
    '[attr.aria-expanded]': 'menuOpen()',
    '[attr.aria-haspopup]': 'true',
    tabindex: '0',
  },
})
export class MeeMenuTrigger {
  private readonly nav = inject(MeeNavigationMenu, { optional: true });
  private readonly parent = inject(MeeMenu, { optional: true });
  private readonly popover = meePopoverPortal();
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly a11y = inject(AccessibleItem, { optional: true });

  readonly meeMenuTrigger = input.required<MeeMenu>();
  readonly meeMenuTriggerData = input();
  readonly options = input<DialogOptions>({});

  private readonly _menuOpen = signal<boolean>(false);
  readonly menuOpen = this._menuOpen.asReadonly();
  readonly events = new Subject<{
    event: MouseEvent;
    type: 'enter' | 'leave' | 'click';
    menu: MeeMenuTrigger;
  }>();
  readonly ayId = signal(uniqueId());
  close: VoidFunction | null = null;
  private closeParent = true;
  private delayTimer: any = 0;
  private isMouseOverTrigger = false;

  constructor() {
    // if a11y is provided, then we should open on keyleft and keyright
    this.a11y?.events.subscribe(ev => {
      if (ev.type === 'key') {
        if (!this.close) {
          this.open();
        } else {
          this.closeParent = false;
          this.closeMenu();
        }
      }
    });
    afterNextRender(() => {
      // if parent is provided, then this is a sub-menu and we should open on mouseenter and close on mouseleave
      if (this.parent || this.nav) {
        this.el.nativeElement.addEventListener('mouseenter', ev => {
          this.events.next({ event: ev, type: 'enter', menu: this });
          this.isMouseOverTrigger = true;
          if (this.nav) {
            return;
          }
          clearTimeout(this.delayTimer);
          console.log('mouseenter');
          this.open(ev);
        });
        this.el.nativeElement.addEventListener('mouseleave', ev => {
          this.events.next({ event: ev, type: 'leave', menu: this });
          this.isMouseOverTrigger = false;
          // console.log('mouseleave');
          if (this.nav) {
            return;
          }
          // only close when x is not same for the el
          const el = this.el.nativeElement.getBoundingClientRect();
          const y = ev.clientY;
          console.log(y, el.top, el.height);
          if (!(y > el.top && y < el.top + el.height) || this.nav) {
            if (this.nav) {
              this.delayTimer = setTimeout(() => {
                this.closeParent = false;
                this.closeMenu();
              }, 300);
            } else {
              this.closeParent = false;
              this.closeMenu();
            }
          }
        });
        // console.log('parent', this.parent);
        this.parent?.events.subscribe(ev => {
          // console.log('parent event', ev);
          if (ev.type === 'enter' && !this.isMouseOverTrigger) {
            this.delayTimer = setTimeout(() => {
              this.closeParent = false;
              this.closeMenu();
            }, 100);
          }
        });
      }
    });
  }

  clickOpen(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.nav) {
      this.events.next({ event: ev, type: 'click', menu: this });
      return;
    } else {
      this.openMenu();
    }
  }

  private open(ev?: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    this.openMenu();
  }

  openMenu() {
    if (this.close) {
      return;
    }
    // console.log('open menu', this.parent);
    const menu = this.meeMenuTrigger();
    const { diaRef, events } = this.popover.open(menu.container()!, {
      ...this.options(),
      data: this.meeMenuTriggerData(),
      backdrop: !this.parent,
      target: this.el.nativeElement,
      position: this.parent ? 'right' : 'bl',
      offset: 4,
      ayId: this.ayId(),
    });
    this._menuOpen.set(true);
    menu.diaRef = diaRef;
    menu.opened();
    this.close = () => {
      menu.close();
      this.close = null;
    };
    if (this.nav) {
      events.subscribe(ev => {
        if (ev.type === 'mouseleave') {
          this.delayTimer = setTimeout(() => {
            this.closeParent = false;
            this.closeMenu();
          }, 300);
        } else {
          clearTimeout(this.delayTimer);
        }
      });
    }
    menu.diaRef?.afterClosed.subscribe(() => {
      if (this.closeParent) this.parent?.close();
      this.closeParent = true;

      this.closeMenu();
    });

    this.parent?.diaRef?.afterClosed.subscribe(() => {
      this.closeMenu();
    });
  }

  closeMenu() {
    this.close?.();
    this.close = null;
    this._menuOpen.set(false);
  }
}
