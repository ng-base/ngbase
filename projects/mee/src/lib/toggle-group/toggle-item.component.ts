import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'button[meeToggleItem]',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block rounded h-9 px-3 hover:bg-opacity-80 active:bg-opacity-70',
    '(click)': 'clicked()',
    '[class.bg-background]': 'active()',
  },
})
export class ToggleItem {
  value = input.required();
  active = signal(false);
  activeChange = new Subject<boolean>();

  clicked() {
    this.active.update(x => !x);
    this.activeChange.next(this.active());
  }
}
