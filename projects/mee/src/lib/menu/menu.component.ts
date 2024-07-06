import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  contentChildren,
  output,
  viewChild,
} from '@angular/core';
import { DialogRef } from '../portal';
import { Keys } from '../keys';
import { Option } from '../select';
import { merge } from 'rxjs';
import { Subscription } from 'rxjs';
import { MenuItem } from './menu-item.directive';

@Component({
  selector: 'mee-menu',
  standalone: true,
  exportAs: 'meeMenu',
  template: `
    <ng-template #container>
      <div (click)="close()" class="flex flex-col">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnDestroy {
  container = viewChild('container', { read: TemplateRef });
  lists = contentChildren(Option, { read: ElementRef });
  manager = new Keys();
  // this will be injected by the MenuTrigger directive
  diaRef?: DialogRef;
  sub?: Subscription;
  selected = output<string>();

  opened() {
    this.sub = new Subscription();
    let active = 0;
    const list = this.lists() as ElementRef<HTMLDivElement>[];
    if (!list.length) {
      return;
    }
    // console.log(list);
    list[0].nativeElement.focus();
    this.sub.add(
      merge(this.manager.event('ArrowDown'), this.manager.event('ArrowUp')).subscribe(
        ([bo, ev]) => {
          if (bo) {
            ev.preventDefault();
            ev.stopPropagation();
            const prev = active;
            if (ev.key === 'ArrowDown') {
              active++;
              active = active === list.length ? 0 : active;
            } else {
              active--;
              active = active === -1 ? list.length - 1 : active;
            }
            console.log(ev.key, active, list[active].nativeElement);
            const el = list[active].nativeElement;
            list[prev].nativeElement.setAttribute('tabindex', '-1');
            el.setAttribute('tabindex', '0');
            el.focus();
            // console.log(list[active].nativeElement);
            // list.forEach((list, i) => {
            //   // list.active.set(i === active);

            // });
          }
        },
      ),
    );

    this.sub.add(
      this.manager.event('Enter').subscribe(([bo, ev]) => {
        if (bo) {
          ev.preventDefault();
          ev.stopPropagation();
          this.selected.emit(list[active].nativeElement.textContent!);
          // list.forEach((list, i) => {
          //   // if (list.active()) {
          //   // this.selected.emit(list.value());
          //   // }
          // });
          this.close();
        }
      }),
    );

    this.diaRef!.afterClosed.subscribe(() => {
      this.sub?.unsubscribe();
    });
  }

  close = () => {
    this.diaRef?.close();
  };

  ngOnDestroy() {
    this.close();
  }
}
