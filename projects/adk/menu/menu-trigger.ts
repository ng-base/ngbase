import { Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';
import { PopoverOptions } from '@ngbase/adk/popover';
import { Subject } from 'rxjs';
import { NgbMenu } from './menu';
import { NgbNavigationMenu } from './navigation-menu';

@Directive({
  selector: '[ngbMenuTrigger]',
  exportAs: 'ngbMenuTrigger',
  host: {
    '(click)': 'clickOpen($event)',
    '[attr.aria-expanded]': 'menuOpen()',
    '[attr.aria-haspopup]': 'true',
    tabindex: '0',
  },
})
export class NgbMenuTrigger {
  private readonly nav = inject(NgbNavigationMenu, { optional: true });
  private readonly parent = inject(NgbMenu, { optional: true });
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly a11y = inject(AccessibleItem, { optional: true });

  readonly ngbMenuTrigger = input.required<NgbMenu>();
  readonly ngbMenuTriggerData = input();
  readonly options = input<Partial<PopoverOptions>>({});

  private readonly _menuOpen = signal<boolean>(false);
  readonly menuOpen = this._menuOpen.asReadonly();
  readonly events = new Subject<{
    event: MouseEvent;
    type: 'enter' | 'leave' | 'click';
    menu: NgbMenuTrigger;
  }>();
  private closeParent = true;
  private delayTimer: any = 0;
  private isMouseOverTrigger = false;

  constructor() {
    // if a11y is provided, then we should open on keyleft and keyright
    this.a11y?.events.subscribe(ev => {
      if (!this.menu.isOpen && ev.type === 'keyRight') {
        this.open();
      } else if (this.menu.isOpen && ev.type === 'keyLeft') {
        this.closeParent = false;
        this.closeMenu();
      }
    });
    afterNextRender(() => {
      this.parent?.activeOption.subscribe(option => {
        if (option?.el.nativeElement === this.el.nativeElement) {
          this.open();
        } else if (this.menu.isOpen) {
          this.closeParent = false;
          this.closeMenu();
        }
      });
      // if parent is provided, then this is a sub-menu and we should open on mouseenter and close on mouseleave
      if (this.parent || this.nav) {
        this.el.nativeElement.addEventListener('mouseenter', ev => {
          this.events.next({ event: ev, type: 'enter', menu: this });
          this.isMouseOverTrigger = true;
          if (this.nav) {
            return;
          }
          clearTimeout(this.delayTimer);
          // console.log('mouseenter', this.debugId());
          this.open(ev);
        });
        this.el.nativeElement.addEventListener('mouseleave', ev => {
          this.events.next({ event: ev, type: 'leave', menu: this });
          this.isMouseOverTrigger = false;
          if (this.nav) {
            return;
          }
        });
      }
    });
  }

  private get menu() {
    return this.ngbMenuTrigger();
  }

  get rootParent() {
    return this.parent?.rootParent || this.parent;
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

  closeMenu() {
    this.ngbMenuTrigger().close();
  }

  openMenu() {
    const menu = this.ngbMenuTrigger();
    if (menu.isOpen) {
      return;
    }
    // console.log('open menu', this.parent);
    // const { diaRef, events } = this.popover.open(menu.container()!, {
    //   ...this.options(),
    //   data: this.ngbMenuTriggerData(),
    //   backdrop: !this.parent,
    //   target: this.el.nativeElement,
    //   position: this.parent ? 'right' : 'bl',
    //   offset: 4,
    //   ayId: this.ayId(),
    // });
    menu.open(
      { ...this.options(), target: this.el.nativeElement, data: this.ngbMenuTriggerData() },
      !!this.parent,
    );
    this._menuOpen.set(true);
    menu.parentMenuTrigger = this;
    // if (this.nav) {
    //   events.subscribe(ev => {
    //     if (ev.type === 'mouseleave') {
    //       this.delayTimer = setTimeout(() => {
    //         this.closeMenu();
    //       }, 300);
    //     } else {
    //       clearTimeout(this.delayTimer);
    //     }
    //   });
    // }
    menu.diaRef?.afterClosed.subscribe(() => {
      if (this.closeParent) this.rootParent?.close();
      this.closeParent = true;
      menu.close();
      this._menuOpen.set(false);
    });
  }
}
