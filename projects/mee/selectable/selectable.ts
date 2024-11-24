import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeSelectable } from '@meeui/adk/selectable';

@Component({
  selector: 'mee-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex relative bg-muted-background rounded-bt p-b0.5',
  },
  hostDirectives: [
    {
      directive: MeeSelectable,
      inputs: ['activeIndex'],
      outputs: ['activeIndexChange', 'valueChanged'],
    },
  ],
})
export class Selectable<T> {}
