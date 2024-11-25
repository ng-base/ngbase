import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTreeNode } from '@meeui/adk/tree';

@Component({
  selector: 'mee-tree-node',
  exportAs: 'meeTreeNode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start">
      <ng-content />
    </div>
    <ng-content select="[meeTreeNodeContent]" />
    <ng-container #container />
  `,
  providers: [{ provide: MeeTreeNode, useExisting: TreeNode }],
  host: {
    class: 'block w-full cursor-pointer',
  },
})
export class TreeNode<T> extends MeeTreeNode<T> {}
