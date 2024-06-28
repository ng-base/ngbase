import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icons } from '@meeui/icon';
import {
  Tree,
  TreeNode,
  TreeNodeContent,
  TreeNodeDef,
  TreeNodeToggle,
} from '@meeui/tree';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronRight } from '@ng-icons/lucide';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';

interface TreeItem {
  id: number;
  name: string;
  level: number;
  isExpanded: boolean;
  children?: TreeItem[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-tree',
  imports: [
    Tree,
    TreeNode,
    TreeNodeDef,
    TreeNodeToggle,
    TreeNodeContent,
    Heading,
    Button,
    Icons,
    NgTemplateOutlet,
    JsonPipe,
    CdkTreeModule,
  ],
  viewProviders: [provideIcons({ lucideChevronDown, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5">Tree</h4>
    <button meeButton (click)="toggle()">Toggle</button>
    @if (show()) {
      <button meeButton variant="outline" (click)="myTree.foldAll()">
        Fold All
      </button>
      <button meeButton variant="outline" (click)="myTree.expandAll()">
        Expand All
      </button>
      <mee-tree
        [dataSource]="items()"
        [trackBy]="trackBy"
        [expanded]="true"
        #myTree
      >
        <mee-tree-node *meeTreeNodeDef="let item; when: hasChild" #myNode>
          <button
            meeTreeNodeToggle
            class="p-2"
            [class.invisible]="!item.children?.length"
          >
            <mee-icon
              [name]="
                myNode.isOpen() ? 'lucideChevronDown' : 'lucideChevronRight'
              "
            ></mee-icon>
          </button>
          {{ item.name }}
          <button meeButton variant="ghost" (click)="add(item)">Add</button>
          <div meeTreeNodeContent class="text-muted-foreground">
            This is the content of {{ item.name }}
          </div>
        </mee-tree-node>
      </mee-tree>
      <!-- <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
        <cdk-tree-node
          *cdkTreeNodeDef="let node"
          cdkTreeNodePadding
          [style.display]="shouldRender(node) ? 'flex' : 'none'"
          class="example-tree-node"
        >
          <button mat-icon-button disabled></button>
          {{ node.name }}
        </cdk-tree-node>
        <cdk-tree-node
          *cdkTreeNodeDef="let node; when: hasChild"
          cdkTreeNodePadding
          [style.display]="shouldRender(node) ? 'flex' : 'none'"
          class="example-tree-node"
        >
          <button
            cdkTreeNodeToggle
            [attr.aria-label]="'Toggle ' + node.name"
            (click)="node.isExpanded = !node.isExpanded"
            [style.visibility]="node.expandable ? 'visible' : 'hidden'"
          >
            <mee-icon
              [name]="
                treeControl.isExpanded(node)
                  ? 'lucideChevronDown'
                  : 'lucideChevronRight'
              "
            ></mee-icon>
          </button>
          {{ node.name }}
        </cdk-tree-node>
      </cdk-tree> -->
    }
  `,
  styles: [
    `
      .example-tree-node {
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class TreeComponent {
  items = signal<TreeItem[]>([]);
  show = signal(true);

  treeControl = new FlatTreeControl<TreeItem>(
    (node) => {
      console.log(node.level);
      return node.level;
    },
    (node) => !!node.children?.length,
  );

  dataSource = new ArrayDataSource(this.items());

  hasChild = (_: number, node: TreeItem) => node.children || [];
  trackBy = (_: number, node: TreeItem) => node.id;

  constructor() {
    // generate complex tree structure using for loop
    const data = [];
    const items = [];
    for (let i = 1; i <= 50; i++) {
      const children: TreeItem[] = [];
      let item: TreeItem = {
        id: i,
        level: 0,
        isExpanded: false,
        name: `Item ${i}`,
        children,
      };
      data.push(item);
      items.push(item);
      for (let j = 1; j <= 3; j++) {
        const subChildren: TreeItem[] = [];
        item = {
          id: j,
          level: 1,
          isExpanded: false,
          name: `Child ${j}`,
          children: subChildren,
        };
        children.push(item);
        data.push(item);
        for (let k = 1; k <= 2; k++) {
          item = {
            id: k,
            level: 2,
            isExpanded: false,
            name: `Sub Child ${k}`,
          };
          subChildren.push(item);
          data.push(item);
        }
      }
    }
    this.dataSource = new ArrayDataSource(data);
    this.items.set(items);
  }

  add(data: TreeItem) {
    data.children = data.children || [];
    data.children.push({
      id: data.children.length + 1,
      level: data.level + 1,
      isExpanded: false,
      name: `Child ${data.children.length + 1}`,
    });
    this.items.update((items) => [...items]);
  }

  toggle() {
    this.show.update((show) => !show);
  }

  // hasChild(_: number, item: TreeItem) {
  //   return item.children && ((item.children.length > 0) as any);
  // }

  getParentNode(node: TreeItem) {
    const items = this.items();
    const nodeIndex = items.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (items[i].level === node.level - 1) {
        return items[i];
      }
    }

    return null;
  }

  shouldRender(node: TreeItem) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }
}
