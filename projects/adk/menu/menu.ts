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
import { AccessibleGroup } from '@meeui/adk/a11y';
import { Keys } from '@meeui/adk/keys';
import { MeeList } from '@meeui/adk/list';
import { DialogRef } from '@meeui/adk/portal';
import { MeeOption } from '@meeui/adk/select';
import { BehaviorSubject, Subject } from 'rxjs';
import { MeeMenuTrigger } from './menu-trigger';
import { injectDirectionality } from '@meeui/adk/bidi';
import { meePopoverPortal, PopoverOptions } from '@meeui/adk/popover';
import { uniqueId } from '@meeui/adk/utils';

@Directive({
  selector: '[meeMenuGroup]',
  hostDirectives: [AccessibleGroup],
  host: {
    '(click)': 'menu.close()',
  },
})
export class MenuGroup {
  readonly menu = inject(MeeMenu);
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
  selector: '[meeMenu]',
  exportAs: 'meeMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccessibleGroup, MenuGroup],
  template: `
    <ng-template #container>
      <div meeMenuGroup>
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class MeeMenu implements OnDestroy {
  readonly dir = injectDirectionality();
  readonly popover = meePopoverPortal();
  private readonly menuEl = viewChild<MenuGroup, ElementRef<HTMLDivElement>>(MenuGroup, {
    read: ElementRef,
  });
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly options = contentChildren(MeeOption);
  readonly lists = contentChildren(MeeList);
  readonly manager = new Keys();
  readonly selected = output<string>();
  readonly ayId = uniqueId();

  // this will be injected by the MenuTrigger directive
  parentMenuTrigger?: MeeMenuTrigger;

  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;
  readonly events = new Subject<{ event: MouseEvent; type: 'enter' | 'leave' }>();
  readonly activeOption = new BehaviorSubject<MeeOption<any> | MeeList | null>(null);
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

  get rootParent(): MeeMenu | undefined {
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

export const provideMenu = (menu: typeof MeeMenu) => ({
  provide: MeeMenu,
  useExisting: menu,
});
