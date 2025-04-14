import {
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { injectDirectionality } from '@ngbase/adk/bidi';
import { Keys } from '@ngbase/adk/keys';
import { NgbList } from '@ngbase/adk/list';
import { ngbPopoverPortal, PopoverOptions } from '@ngbase/adk/popover';
import { DialogRef } from '@ngbase/adk/portal';
import { NgbOption } from '@ngbase/adk/select';
import { uniqueId } from '@ngbase/adk/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgbMenuTrigger } from './menu-trigger';

@Directive({
  selector: '[ngbMenuGroup]',
  hostDirectives: [AccessibleGroup],
  host: {
    '(click)': 'menu.noAutoClose() ? null : menu.close()',
  },
})
export class NgpMenuGroup {
  readonly menu = inject(NgbMenu);
  readonly allyGroup = inject(AccessibleGroup);

  constructor() {
    // we need to wait for angular to check the changes
    // on component creation this data is not available
    effect(() => {
      this.allyGroup._ayId.set(this.menu.diaRef.options.ayId!);
      this.allyGroup._isPopup.set(true);
    });
  }
}

@Directive({
  selector: 'ng-template[ngbMenuContent]',
})
export class NgpMenuContent {}

@Directive({
  selector: '[ngbMenu]',
  exportAs: 'ngbMenu',
})
export class NgbMenu implements OnDestroy {
  readonly dir = injectDirectionality();
  readonly popover = ngbPopoverPortal();
  private readonly menuEl = viewChild<NgpMenuGroup, ElementRef<HTMLDivElement>>(NgpMenuGroup, {
    read: ElementRef,
  });
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly content = contentChildren(NgpMenuContent, { read: TemplateRef, descendants: true });
  readonly options = contentChildren(NgbOption, { descendants: true });
  readonly lists = contentChildren(NgbList, { descendants: true });
  readonly manager = new Keys();
  readonly selected = output<string>();
  readonly ayId = uniqueId();

  readonly noAutoClose = input<boolean>(false);

  // this will be injected by the MenuTrigger directive
  parentMenuTrigger?: NgbMenuTrigger;

  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;
  readonly events = new Subject<{ event: MouseEvent; type: 'enter' | 'leave' }>();
  readonly activeOption = new BehaviorSubject<NgbOption<any> | NgbList | null>(null);
  isOpen = false;

  constructor() {
    effect(cleanup => {
      const options = this.options().length ? this.options() : this.lists();
      options.forEach(option => {
        const mouseover = () => {
          if (this.activeOption.getValue() !== option) {
            this.activeOption.next(option);
          }
        };
        option.el.nativeElement.addEventListener('mouseover', mouseover);
        cleanup(() => option.el.nativeElement.removeEventListener('mouseover', mouseover));
      });
    });
    effect(cleanup => {
      const el = this.menuEl()?.nativeElement;
      if (!el) {
        return;
      }
      const enter = (ev: MouseEvent) => this.events.next({ event: ev, type: 'enter' });
      const leave = (ev: MouseEvent) => this.events.next({ event: ev, type: 'leave' });
      // we need to fire the mouseenter event
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      cleanup(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    });
  }

  open(options: PopoverOptions, subMenu: boolean = false) {
    const rtl = this.dir.isRtl();
    const content = this.content()[0];
    const template = content || this.container()!;

    const { diaRef } = this.popover.open(template, {
      ...this.options(),
      backdrop: !subMenu,
      position: subMenu ? (rtl ? 'ls' : 'rs') : rtl ? 'br' : 'bl',
      offset: 4,
      ayId: this.ayId,
      data: options.data,
      ...options,
    });
    this.diaRef = diaRef;
    this.opened();
  }

  opened() {
    this.isOpen = true;
    this.options().forEach(list => {
      list.setAyId(this.diaRef.options.ayId!);
    });
    this.lists().forEach(list => {
      list.setAyId(this.diaRef.options.ayId!);
    });
  }

  get rootParent(): NgbMenu | undefined {
    return this.parentMenuTrigger?.rootParent || this;
  }

  close = (data?: any) => {
    if (!this.isOpen) return;
    this.diaRef?.close(data);
    this.activeOption.next(null);
    this.isOpen = false;
  };

  ngOnDestroy() {
    this.close();
  }
}

export const aliasMenu = (menu: typeof NgbMenu) => ({
  provide: NgbMenu,
  useExisting: menu,
});
