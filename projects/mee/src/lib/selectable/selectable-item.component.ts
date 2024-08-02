import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Selectable } from './selectable.component';

@Component({
  standalone: true,
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-b3 py-b1.5 cursor-pointer transition-colors rounded-bt whitespace-nowrap',
    '[class]': `selected() ? 'bg-foreground shadow-md ring-1 ring-border' : 'opacity-60'`,
    '(click)': 'select()',
    role: 'tab',
    '[attr.aria-selected]': 'selected()',
  },
})
export class SelectableItem<T> {
  selectable: Selectable<T> = inject(Selectable);
  selected = signal(false);
  value = input.required<T>();

  select() {
    // ...implemented in Selectable
  }
}
