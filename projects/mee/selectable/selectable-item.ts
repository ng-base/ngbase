import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { Selectable } from './selectable';

@Component({
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-b3 py-b1.5 cursor-pointer transition-colors rounded-bt whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    '[class]': `selected() ? 'bg-foreground shadow-md ring-1 ring-border' : 'opacity-60'`,
    '(click)': 'select()',
    role: 'tab',
    '[attr.aria-selected]': 'selected()',
  },
  hostDirectives: [AccessibleItem],
})
export class SelectableItem<T> {
  readonly selectable: Selectable<T> = inject(Selectable);
  readonly value = input.required<T>();

  readonly selected = computed(() => this.value() === this.selectable.activeIndex());

  constructor() {
    inject(AccessibleItem).ayId.set(this.selectable.ayId);
  }

  select() {
    this.selectable.setValue(this.value());
  }
}
