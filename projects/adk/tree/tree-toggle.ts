import { Directive, inject } from '@angular/core';
import { NgbTreeNode } from './tree-node';

@Directive({
  selector: '[ngbTreeNodeToggle]',
  host: {
    '(click)': 'toggle()',
    '[attr.aria-hidden]': '!treeNode.hasChildren()',
    tabIndex: '-1',
  },
})
export class NgbTreeNodeToggle {
  treeNode = inject(NgbTreeNode);

  toggle() {
    if (this.treeNode.hasChildren()) {
      this.treeNode.toggle();
    }
  }
}

@Directive({
  selector: '[ngbTreeNodeDef]',
})
export class NgbTreeNodeDef<T> {}

@Directive({
  selector: '[ngbTreeNodeContent]',
})
export class NgbTreeNodeContent {}
