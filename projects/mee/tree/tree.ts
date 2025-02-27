import { ChangeDetectionStrategy, Component, Directive, signal } from '@angular/core';
import {
  NgbTree,
  NgbTreeNode,
  NgbTreeNodeContent,
  NgbTreeNodeDef,
  NgbTreeNodeToggle,
  aliasTree,
  aliasTreeNode,
} from '@ngbase/adk/tree';

@Component({
  selector: 'mee-tree',
  exportAs: 'meeTree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTree(Tree)],
  template: `<ng-container #container />`,
  host: {
    class: 'block',
  },
})
export class Tree<T> extends NgbTree<T> {}

@Component({
  selector: 'mee-tree-node',
  exportAs: 'meeTreeNode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTreeNode(TreeNode)],
  template: `
    <div class="flex items-start">
      <ng-content />
    </div>
    <ng-content select="[meeTreeNodeContent]" />
    <ng-container #container />
  `,
  host: {
    class: 'block w-full cursor-pointer',
  },
})
export class TreeNode<T> extends NgbTreeNode<T> {
  override size = signal(16);
}

@Directive({
  selector: '[meeTreeNodeToggle]',
  hostDirectives: [NgbTreeNodeToggle],
  host: {
    class: `aria-[hidden="true"]:invisible`,
  },
})
export class TreeNodeToggle {}

@Directive({
  selector: '[meeTreeNodeDef]',
  hostDirectives: [NgbTreeNodeDef],
})
export class TreeNodeDef<T> {}

@Directive({
  selector: '[meeTreeNodeContent]',
  hostDirectives: [NgbTreeNodeContent],
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
