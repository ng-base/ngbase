import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { ToggleGroup } from './toggle-group';
import { AccessibleItem } from '../a11y/accessiblity-item.directive';

@Component({
  standalone: true,
  selector: 'button[meeToggleItem]',
  template: `<ng-content></ng-content>`,
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
export class ToggleItem {
  private accessibleItem = inject(AccessibleItem);

  readonly toggleGroup = inject(ToggleGroup);
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly value = input.required<any>();
  readonly active = computed(() => {
    if (this.toggleGroup.multiple()) {
      return this.toggleGroup.value()?.includes(this.value());
    }
    return this.value() === this.toggleGroup.value();
  });

  constructor() {
    this.accessibleItem.ayId.set(this.toggleGroup.ayId);
    // effect(
    //   () => {
    //     this.accessibleItem.pressed.set(this.active());
    //     this.accessibleItem.disabled.set(this.disabled() || this.toggleGroup.disabled());
    //   },
    //   { allowSignalWrites: true },
    // );
  }

  updateValue() {
    // override the method in the ToggleGroup component
  }
}
