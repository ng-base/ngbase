import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeTree,
  MeeTreeNode,
  MeeTreeNodeContent,
  MeeTreeNodeDef,
  MeeTreeNodeToggle,
  provideTree,
  provideTreeNode,
} from '@meeui/adk/tree';

@Component({
  selector: 'mee-tree',
  exportAs: 'meeTree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container />`,
  providers: [provideTree(Tree)],
  host: {
    class: 'block',
  },
})
export class Tree<T> extends MeeTree<T> {}

@Component({
  selector: 'mee-tree-node',
  exportAs: 'meeTreeNode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start">
      <ng-content />
    </div>
    <ng-content select="[meeTreeNodeContent]" />
    <ng-container #container />
  `,
  providers: [provideTreeNode(TreeNode)],
  host: {
    class: 'block w-full cursor-pointer',
  },
})
export class TreeNode<T> extends MeeTreeNode<T> {}

@Directive({
  selector: '[meeTreeNodeToggle]',
  hostDirectives: [MeeTreeNodeToggle],
  host: {
    class: `aria-[hidden="true"]:invisible`,
  },
})
export class TreeNodeToggle {}

@Directive({
  selector: '[meeTreeNodeDef]',
  hostDirectives: [MeeTreeNodeDef],
})
export class TreeNodeDef<T> {}

@Directive({
  selector: '[meeTreeNodeContent]',
  hostDirectives: [MeeTreeNodeContent],
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
