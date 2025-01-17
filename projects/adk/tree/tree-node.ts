import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { injectDirectionality } from '@meeui/adk/bidi';
import { MeeTree, TREE_NODE_DATA, TreeNodeData } from './tree';
import { MeeTreeNodeDef } from './tree-toggle';

@Component({
  selector: '[meeTreeNode]',
  exportAs: 'meeTreeNode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      .tree-node {
        display: flex;
        align-items: start;
      }
    </style>
    <div class="tree-node">
      <ng-content />
    </div>
    <ng-content select="[meeTreeNodeContent]" />
    <ng-container #container />
  `,
  hostDirectives: [AccessibleItem],
  host: {
    '[style]': 'padding()',
    '(selectedChange)': 'toggle()',
    '[ayId]': 'tree.ayId',
    '[level]': 'data.level',
    '[expandable]': 'hasChildren()',
    '[expanded]': 'isOpen()',
    role: 'treeitem',
    '[attr.aria-expanded]': 'isOpen()',
  },
})
export class MeeTreeNode<T> {
  readonly treeNodeDef = inject(MeeTreeNodeDef);
  readonly tree = inject<MeeTree<T>>(MeeTree);
  readonly data = inject<TreeNodeData<T>>(TREE_NODE_DATA);
  readonly container = viewChild('container', { read: ViewContainerRef });

  readonly isOpen = computed(() => this.tree.opened().has(this.data.details.id));
  readonly parent = computed(() => this.tree.getNode(this.data.details.parentId!));
  private readonly children = computed(() => {
    const _ = this.tree.dataSource();
    const when = this.tree.children();
    const v = when(this.data.data) || [];
    return v;
  });
  readonly hasChildren = computed(() => this.children().length > 0);
  readonly dir = injectDirectionality();
  readonly size = signal(32);
  readonly padding = computed(() => ({
    [this.dir.isRtl() ? 'paddingRight' : 'paddingLeft']: this.data.level * this.size() + 'px',
  }));

  constructor() {
    const a11yItem = inject(AccessibleItem);
    a11yItem._ayId.set(this.tree.ayId);
    a11yItem.level.set(this.data.level);
    a11yItem._expandable = linkedSignal(this.hasChildren);
    a11yItem._expanded = linkedSignal(this.isOpen);

    a11yItem.selectedChange.subscribe(() => {
      this.toggle();
    });
  }

  toggle() {
    if (this.hasChildren()) {
      this.tree.toggle(this.data.details);
    }
  }

  // keyboardEvent(key: 'ArrowRight' | 'ArrowLeft') {
  //   // 1. if right arrow, open the node based on the isOpen
  //   // 2. if left arrow, close the node based on the isOpen
  //   // 3. if left arrow and isOpen, focus the previous sibling
  //   // 4. if right arrow and isOpen, focus the next sibling

  //   if (key === 'ArrowRight') {
  //     if (this.isOpen()) {
  //       // this.children()?.[0]?.focus();
  //     } else {
  //       this.toggle();
  //     }
  //   } else if (key === 'ArrowLeft') {
  //     if (this.isOpen()) {
  //       this.toggle();
  //     } else {
  //       // this.parent()?.focus();
  //     }
  //   }
  // }
}

export function provideTreeNode<T>(treeNode: Type<MeeTreeNode<T>>) {
  return { provide: MeeTreeNode, useExisting: treeNode };
}
