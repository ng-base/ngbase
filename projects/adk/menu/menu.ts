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
import { Subject } from 'rxjs';

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
    this.allyGroup._ayId.set(this.menu.diaRef.options.ayId!);
    this.allyGroup._isPopup.set(true);
  }
}

@Component({
  selector: 'mee-menu',
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
  private readonly menuEl = viewChild<MenuGroup, ElementRef<HTMLDivElement>>(MenuGroup, {
    read: ElementRef,
  });
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly options = contentChildren(MeeOption);
  readonly lists = contentChildren(MeeList);
  readonly manager = new Keys();
  readonly selected = output<string>();
  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;
  readonly events = new Subject<{ event: MouseEvent; type: 'enter' | 'leave' }>();

  constructor() {
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

  opened() {
    this.options().forEach(list => {
      list.setAyId(this.diaRef.options.ayId!);
    });
    this.lists().forEach(list => {
      list.setAyId(this.diaRef.options.ayId!);
    });
  }

  close = () => {
    this.diaRef?.close();
  };

  ngOnDestroy() {
    this.close();
  }
}

export const provideMenu = (menu: typeof MeeMenu) => ({
  provide: MeeMenu,
  useExisting: menu,
});
