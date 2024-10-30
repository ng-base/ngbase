import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { TREE_NODE_DATA, Tree, TreeNodeData } from './tree';
import { AccessibleItem } from '../a11y';
import { TreeNodeDef } from './tree-toggle';

@Component({
  standalone: true,
  selector: 'mee-tree-node',
  imports: [AccessibleItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [style.paddingLeft.px]="data.level * 32"
      meeAccessibleItem
      (selectedChange)="toggle()"
      [ayId]="tree.ayId"
      [level]="data.level"
      [expandable]="hasChildren()"
      [expanded]="isOpen()"
      role="treeitem"
      [attr.aria-expanded]="isOpen()"
    >
      <div class="flex items-start">
        <ng-content />
      </div>
      <ng-content select="[meeTreeNodeContent]" />
      <ng-container #container />
    </div>
  `,
  host: {
    class: 'block w-full cursor-pointer',
  },
})
export class TreeNode<T> {
  $implict: any;
  treeNodeDef = inject(TreeNodeDef);
  tree = inject<Tree<T>>(Tree);
  data = inject<TreeNodeData<T>>(TREE_NODE_DATA);
  container = viewChild('container', { read: ViewContainerRef });
  isOpen = computed(() => this.tree.opened().has(this.data.details.id));
  parent = computed(() => {
    return this.tree.getNode(this.data.details.parentId!);
  });
  private children = computed(() => {
    const _ = this.tree.dataSource();
    const when = this.tree.children();
    const v = when(this.data.data) || [];
    return v;
  });
  hasChildren = computed(() => this.children().length > 0);

  toggle() {
    if (this.hasChildren()) {
      this.tree.toggle(this.data.details);
    }
  }

  keyboardEvent(key: 'ArrowRight' | 'ArrowLeft') {
    // 1. if right arrow, open the node based on the isOpen
    // 2. if left arrow, close the node based on the isOpen
    // 3. if left arrow and isOpen, focus the previous sibling
    // 4. if right arrow and isOpen, focus the next sibling

    if (key === 'ArrowRight') {
      if (this.isOpen()) {
        // this.children()?.[0]?.focus();
      } else {
        this.toggle();
      }
    } else if (key === 'ArrowLeft') {
      if (this.isOpen()) {
        this.toggle();
      } else {
        // this.parent()?.focus();
      }
    }
  }
}
