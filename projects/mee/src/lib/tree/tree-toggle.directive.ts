import { Directive, inject } from '@angular/core';
import { TreeNode } from './tree-node.component';

@Directive({
  standalone: true,
  selector: '[meeTreeNodeToggle]',
  host: {
    '(click)': 'toggle()',
  },
})
export class TreeNodeToggle {
  treeNode = inject(TreeNode);

  toggle() {
    if (this.treeNode.hasChildren()) {
      this.treeNode.toggle();
    }
  }
}
