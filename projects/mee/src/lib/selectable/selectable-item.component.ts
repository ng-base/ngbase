import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Selectable } from './selectable.component';

@Component({
  standalone: true,
  selector: 'mee-selectable-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-3 py-1 cursor-pointer transition-colors rounded-base whitespace-nowrap',
    '[class]': `selected() ? 'bg-foreground shadow-sm' : ''`,
    '(click)': 'select()',
  },
})
export class SelectableItem {
  selectable = inject(Selectable);
  selected = signal(false);

  select() {
    this.selectable.activeIndex.update(() =>
      this.selectable.items().indexOf(this),
    );
  }
}
