import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTree } from '@meeui/adk/tree';

@Component({
  selector: 'mee-tree',
  exportAs: 'meeTree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container />`,
  providers: [{ provide: MeeTree, useExisting: Tree }],
  host: {
    class: 'block',
  },
})
export class Tree<T> extends MeeTree<T> {}
