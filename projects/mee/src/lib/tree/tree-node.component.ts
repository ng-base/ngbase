import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Icons } from '../icon';
import { TREE_NODE_DATA, Tree } from './tree.component';
import { TreeNodeDef } from './tree-node.directive';

@Component({
  standalone: true,
  selector: 'mee-tree-node',
  imports: [Icons],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center">
      <ng-content></ng-content>
    </div>
    <ng-content select="[meeTreeNodeContent]"></ng-content>
    <ng-container #container></ng-container>
  `,
  host: {
    class: 'block w-full',
    '[style.marginLeft.px]': 'data.level * 32',
  },
})
export class TreeNode {
  treeNodeDef = inject(TreeNodeDef);
  tree = inject(Tree);
  data = inject(TREE_NODE_DATA);
  container = viewChild('container', { read: ViewContainerRef });
  isOpen = computed(() => this.tree.opened().has(this.data.data));
  private children = computed(() => {
    const when = this.treeNodeDef!.meeTreeNodeDefWhen();
    return when?.(0, this.data.data) || [];
  });
  hasChildren = computed(() => {
    return this.children().length ? true : false;
  });

  constructor() {}

  toggle() {
    // this.isOpen.update((isOpen) => !isOpen);
    const children = this.children();
    if (children.length) {
      this.tree.toggle(this.data.data, children);
    }
  }
}
