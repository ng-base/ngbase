import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbSelectable, NgbSelectableItem } from '@ngbase/adk/selectable';

@Component({
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbSelectableItem, inputs: ['value'] }],
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-3 py-1.5 cursor-pointer transition-colors rounded-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    '[class]': `selectable.selected() ? 'bg-foreground shadow-md ring-1 ring-border' : 'opacity-60'`,
  },
})
export class SelectableItem<T> {
  readonly selectable = inject(NgbSelectableItem);
}

@Component({
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-md p-0.5',
  },
  hostDirectives: [
    {
      directive: NgbSelectable,
      inputs: ['activeIndex'],
      outputs: ['activeIndexChange', 'valueChanged'],
    },
  ],
})
export class Selectable<T> {}
