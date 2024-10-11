import { Directive, inject } from '@angular/core';
import { TreeNode } from './tree-node';

@Directive({
  standalone: true,
  selector: '[meeTreeNodeToggle]',
  host: {
    '(click)': 'toggle()',
    '[class.invisible]': '!treeNode.hasChildren()',
    tabIndex: '-1',
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

@Directive({
  standalone: true,
  selector: '[meeTreeNodeDef]',
})
export class TreeNodeDef<T> {}

@Directive({
  standalone: true,
  selector: '[meeTreeNodeContent]',
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
