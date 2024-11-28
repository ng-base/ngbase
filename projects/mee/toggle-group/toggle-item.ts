import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { ToggleGroup } from './toggle-group';

@Component({
  selector: 'button[meeToggleItem]',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block rounded h-9 px-3 hover:bg-opacity-80 active:bg-opacity-70',
    '(click)': 'updateValue()',
    '[class.bg-background]': 'active()',
  },
  hostDirectives: [
    {
      directive: AccessibleItem,
      inputs: ['disabled'],
    },
  ],
})
export class ToggleItem<T> {
  private accessibleItem = inject(AccessibleItem);

  readonly toggleGroup = inject<ToggleGroup<T>>(ToggleGroup);
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
  }

  updateValue() {
    this.toggleGroup.updateValue([this.value()]);
  }
}
