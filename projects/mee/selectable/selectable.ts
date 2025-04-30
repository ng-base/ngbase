import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbSelectable, NgbSelectableItem } from '@ngbase/adk/selectable';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Component({
  selector: 'mee-selectable-item, [meeSelectableItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbSelectableItem, inputs: ['value'] }, FocusStyle],
  template: `<ng-content />`,
  host: {
    class:
      'flex-1 flex items-center font-medium justify-center px-3 py-1.5 cursor-pointer transition-colors rounded-md whitespace-nowrap border',
    '[class]': `selectable.selected() ? 'bg-background text-primary shadow-md border-border' : 'opacity-60 border-transparent'`,
  },
})
export class SelectableItem<T> {
  readonly selectable = inject(NgbSelectableItem);
}

@Component({
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgbSelectable,
      inputs: ['activeIndex'],
      outputs: ['activeIndexChange', 'valueChanged'],
    },
  ],
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted text-muted-foreground rounded-md p-0.5',
  },
})
export class Selectable<T> {}
