import { booleanAttribute, computed, Directive, inject, input, linkedSignal } from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';
import { NgbToggleGroup } from './toggle-group';

@Directive({
  selector: 'button[ngbToggleItem]',
  hostDirectives: [{ directive: AccessibleItem, inputs: ['disabled'] }],
  host: {
    '(click)': 'updateValue()',
  },
})
export class NgbToggleItem<T> {
  private accessibleItem = inject(AccessibleItem);
  readonly toggleGroup = inject<NgbToggleGroup<T>>(NgbToggleGroup);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly value = input.required<any>();

  readonly active = computed(() => {
    const values = this.toggleGroup.value();
    if (Array.isArray(values)) {
      return values.includes(this.value());
    }
    return values === this.value();
  });

  constructor() {
    this.accessibleItem._ayId.set(this.toggleGroup.ayId);
    this.accessibleItem._disabled = linkedSignal(this.disabled);
    this.accessibleItem._selected = linkedSignal(this.active);
  }

  updateValue() {
    this.toggleGroup.updateValue([this.value()]);
  }
}
