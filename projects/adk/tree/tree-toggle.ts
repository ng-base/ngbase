import { Directive, inject } from '@angular/core';
import { MeeTreeNode } from './tree-node';

@Directive({
  selector: '[meeTreeNodeToggle]',
  host: {
    '(click)': 'toggle()',
    '[attr.aria-hidden]': '!treeNode.hasChildren()',
    tabIndex: '-1',
  },
})
export class MeeTreeNodeToggle {
  treeNode = inject(MeeTreeNode);

  toggle() {
    if (this.treeNode.hasChildren()) {
      this.treeNode.toggle();
    }
  }
}

@Directive({
  selector: '[meeTreeNodeDef]',
})
export class MeeTreeNodeDef<T> {}

@Directive({
  selector: '[meeTreeNodeContent]',
})
export class MeeTreeNodeContent {}
