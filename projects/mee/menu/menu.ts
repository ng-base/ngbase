import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  contentChildren,
  effect,
  output,
  viewChild,
} from '@angular/core';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { DialogRef } from '@meeui/adk/portal';
import { Keys } from '@meeui/adk/keys';
import { List } from '@meeui/ui/list';
import { Option } from '@meeui/ui/select';
import { Subject } from 'rxjs';

@Component({
  selector: 'mee-menu',
  exportAs: 'meeMenu',
  imports: [AccessibleGroup],
  template: `
    <ng-template #container>
      <div
        #menu
        (click)="close()"
        class="flex flex-col p-b"
        meeAccessibleGroup
        [ayId]="this.diaRef.options.ayId"
        [isPopup]="true"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnDestroy {
  private readonly menuEl = viewChild<ElementRef<HTMLDivElement>>('menu');
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly options = contentChildren(Option);
  readonly lists = contentChildren(List);
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
