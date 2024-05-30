import { Directive, contentChildren } from '@angular/core';
import { DialogRef } from '../portal';
import { Keys } from '../keys';
import { Option } from '../select';
import { merge } from 'rxjs';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[meeMenuS]',
  standalone: true,
  exportAs: 'meeMenuS',
})
export class MenuS {
  lists = contentChildren(Option);
  manager = new Keys();
  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;
  sub?: Subscription;

  closed() {
    this.sub?.unsubscribe();
  }

  opened() {
    let active = 0;
    console.log('keys');
    this.sub = merge(
      this.manager.event('ArrowDown'),
      this.manager.event('ArrowUp'),
    ).subscribe(([bo, ev]) => {
      if (bo) {
        this.lists().forEach((list, i) => {
          list.active.set(i === active);
        });
      }
    });
  }

  close() {
    this.diaRef.close();
  }
}
