import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Selectable } from './selectable.component';

@Component({
  standalone: true,
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-3 py-1 cursor-pointer transition-colors rounded-base whitespace-nowrap',
    '[class]': `selected() ? 'bg-foreground shadow-md' : 'opacity-60'`,
    '(click)': 'select()',
    role: 'tab',
  },
})
export class SelectableItem<T> {
  selectable: Selectable<T> = inject(Selectable);
  selected = signal(false);
  value = input.required<T>();

  select() {
    this.selectable.activeIndex.set(this.value());
  }
}
