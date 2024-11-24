import { Directive, computed, inject, input } from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { MeeSelectable } from './selectable';

@Directive({
  selector: '[meeSelectableItem]',
  host: {
    role: 'tab',
    '(click)': 'select()',
    '[attr.aria-selected]': 'selected()',
  },
  hostDirectives: [AccessibleItem],
})
export class MeeSelectableItem<T> {
  readonly selectable: MeeSelectable<T> = inject(MeeSelectable);
  readonly value = input.required<T>();

  readonly selected = computed(() => this.value() === this.selectable.activeIndex());

  constructor() {
    inject(AccessibleItem).ayId.set(this.selectable.ayId);
  }

  select() {
    this.selectable.setValue(this.value()!);
  }
}
