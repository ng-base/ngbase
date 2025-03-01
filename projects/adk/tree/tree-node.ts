import {
  computed,
  Directive,
  inject,
  linkedSignal,
  signal,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { AccessibleItem } from '@ngbase/adk/a11y';
import { injectDirectionality } from '@ngbase/adk/bidi';
import { NgbTree, TREE_NODE_DATA, TreeNodeData } from './tree';
import { NgbTreeNodeDef } from './tree-toggle';

@Directive({
  selector: '[ngbTreeNode]',
  exportAs: 'ngbTreeNode',
  hostDirectives: [AccessibleItem],
  host: {
    role: 'treeitem',
    '[style]': 'padding()',
    '[attr.aria-expanded]': 'isOpen()',
  },
})
export class NgbTreeNode<T> {
  readonly treeNodeDef = inject(NgbTreeNodeDef);
  readonly tree = inject<NgbTree<T>>(NgbTree);
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

export function aliasTreeNode<T>(treeNode: Type<NgbTreeNode<T>>) {
  return { provide: NgbTreeNode, useExisting: treeNode };
}
