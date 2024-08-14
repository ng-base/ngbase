import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Icons } from '../icon';
import { TREE_NODE_DATA, Tree, TreeNodeData } from './tree.component';
import { TreeNodeDef } from './tree-node.directive';

@Component({
  standalone: true,
  selector: 'mee-tree-node',
  imports: [Icons],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [style.paddingLeft.px]="data.level * 32">
      <div class="flex items-start">
        <ng-content></ng-content>
      </div>
      <ng-content select="[meeTreeNodeContent]"></ng-content>
      <ng-container #container></ng-container>
    </div>
  `,
  host: {
    class: 'block w-full cursor-pointer',
  },
})
export class TreeNode<T> {
  $implict: any;
  treeNodeDef = inject(TreeNodeDef);
  tree = inject(Tree);
  data = inject<TreeNodeData<T>>(TREE_NODE_DATA);
  container = viewChild('container', { read: ViewContainerRef });
  isOpen = computed(() => this.tree.opened().has(this.data.details.id));
  parent = computed(() => {
    return this.tree.getNode(this.data.details.parentId!);
  });
  hasChildren = computed(() => {
    const _ = this.tree.dataSource();
    const when = this.tree.children();
    const v = when(this.data.data) || [];
    return v.length ? true : false;
  });

  toggle() {
    if (this.hasChildren()) {
      this.tree.toggle(this.data.details);
    }
  }
}
