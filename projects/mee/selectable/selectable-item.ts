import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MeeSelectableItem } from '@meeui/adk/selectable';

@Component({
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-b3 py-b1.5 cursor-pointer transition-colors rounded-bt whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    '[class]': `selectable.selected() ? 'bg-foreground shadow-md ring-1 ring-border' : 'opacity-60'`,
  },
  hostDirectives: [{ directive: MeeSelectableItem, inputs: ['value'] }],
})
export class SelectableItem<T> {
  readonly selectable = inject(MeeSelectableItem);
}
