import { Directive, computed, inject, input } from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';
import { NgbSelectable } from './selectable';

@Directive({
  selector: '[ngbSelectableItem]',
  host: {
    role: 'tab',
    '(click)': 'select()',
    '[attr.aria-selected]': 'selected()',
  },
  hostDirectives: [AccessibleItem],
})
export class NgbSelectableItem<T> {
  readonly selectable: NgbSelectable<T> = inject(NgbSelectable);
  readonly value = input.required<T>();

  readonly selected = computed(() => this.value() === this.selectable.activeIndex());

  constructor() {
    inject(AccessibleItem)._ayId.set(this.selectable.ayId);
  }

  select() {
    this.selectable.setValue(this.value()!);
  }
}
