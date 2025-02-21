import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  contentChildren,
  effect,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { Keys } from '@ngbase/adk/keys';
import { NgbList } from '@ngbase/adk/list';
import { DialogRef } from '@ngbase/adk/portal';
import { NgbOption } from '@ngbase/adk/select';
import { BehaviorSubject, Subject } from 'rxjs';
import { NgbMenuTrigger } from './menu-trigger';
import { injectDirectionality } from '@ngbase/adk/bidi';
import { ngbPopoverPortal, PopoverOptions } from '@ngbase/adk/popover';
import { uniqueId } from '@ngbase/adk/utils';

@Directive({
  selector: '[ngbMenuGroup]',
  hostDirectives: [AccessibleGroup],
  host: {
    '(click)': 'menu.close()',
  },
})
export class MenuGroup {
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

@Component({
  selector: '[ngbMenu]',
  exportAs: 'ngbMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccessibleGroup, MenuGroup],
  template: `
    <ng-template #container>
      <div ngbMenuGroup>
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class NgbMenu implements OnDestroy {
  readonly dir = injectDirectionality();
  readonly popover = ngbPopoverPortal();
  private readonly menuEl = viewChild<MenuGroup, ElementRef<HTMLDivElement>>(MenuGroup, {
    read: ElementRef,
  });
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly options = contentChildren(NgbOption, { descendants: true });
  readonly lists = contentChildren(NgbList, { descendants: true });
  readonly manager = new Keys();
  readonly selected = output<string>();
  readonly ayId = uniqueId();

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
    const { diaRef } = this.popover.open(this.container()!, {
      ...this.options(),
      backdrop: !subMenu,
      position: subMenu ? (rtl ? 'left' : 'right') : rtl ? 'br' : 'bl',
      offset: 4,
      ayId: this.ayId,
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

  close = () => {
    if (!this.isOpen) return;
    this.diaRef?.close();
    this.activeOption.next(null);
    this.isOpen = false;
  };

  ngOnDestroy() {
    this.close();
  }
}

export const provideMenu = (menu: typeof NgbMenu) => ({
  provide: NgbMenu,
  useExisting: menu,
});
