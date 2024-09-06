import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icon } from '@meeui/icon';
import { Tree, TreeNode, TreeNodeContent, TreeNodeDef, TreeNodeToggle } from '@meeui/tree';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronRight } from '@ng-icons/lucide';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { Labels, TREE_DATA } from './tree-data';

interface TreeItem {
  id: number;
  name: string;
  level: number;
  isExpanded: boolean;
  children?: TreeItem[];
}

/** Flat node with expandable and level information */
interface FlatNode<T> {
  expandable: boolean;
  data: T;
  level: number;
  isExpanded?: boolean;
}

class TreeFlatNode<T> {
  data: FlatNode<T>[] = [];
  private levelData = new Map<number, WeakSet<FlatNode<T>>>();
  constructor(private children: (node: T) => T[]) {}

  setDataSource(data: T[]) {
    this.setChildren(data, 0);
  }

  private setChildren(children: T[], level: number) {
    const val = this.levelData.get(level) || new WeakSet<FlatNode<T>>();
    children.forEach((node, index) => {
      const children = this.children(node);
      const value: FlatNode<T> = { data: node, level, expandable: children.length > 0 };
      this.data.push(value);
      val.add(value);
      if (children.length) {
        this.setChildren(children, level + 1);
      }
    });
    this.levelData.set(level, val);
  }
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
    Icon,
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
      <button meeButton variant="outline" (click)="myTree.foldAll()">Fold All</button>
      <button meeButton variant="outline" (click)="myTree.expandAll()">Expand All</button>
      <mee-tree
        [dataSource]="items()"
        [trackBy]="trackBy"
        [children]="getChildren"
        [expanded]="false"
        #myTree
      >
        <mee-tree-node *meeTreeNodeDef="let item" #myNode>
          <button meeButton variant="ghost" meeTreeNodeToggle class="h-9 w-9 !p-b2">
            <mee-icon
              size="20px"
              [name]="myNode.isOpen() ? 'lucideChevronDown' : 'lucideChevronRight'"
            ></mee-icon>
          </button>
          {{ item.name }}
          <button meeButton variant="ghost" class="small" (click)="add(item)">Add</button>
          <button
            meeButton
            variant="ghost"
            class="small"
            (click)="deleteItem(item, myNode.parent())"
          >
            delete
          </button>
          <!-- <div meeTreeNodeContent class="text-muted-foreground">
            This is the content of {{ item.Mame }}
          </div> -->
        </mee-tree-node>
      </mee-tree>
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

  items1 = signal<Labels[]>(TREE_DATA);
  trackBy1 = (_: number, node: any) => node.data.Id;
  getChildren1 = (node: Labels) => node.ChildLabels || [];
  // treeControl = new FlatTreeControl<TreeItem>(
  //   node => {
  //     console.log(node.level);
  //     return node.level;
  //   },
  //   node => !!node.children?.length,
  // );

  // dataSource = new ArrayDataSource(this.items());

  getChildren = (node: TreeItem) => node.children || [];
  trackBy = (_: number, node: any) => node.id;

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
    // this.dataSource = new ArrayDataSource(data);
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
    this.items1.update(items => [...items]);
  }

  deleteItem(data: Labels, parent: Labels) {
    // const parent = this.getParentNode(data);
    if (parent) {
      parent.ChildLabels = parent.ChildLabels?.filter(item => item !== data);
      this.items1.update(items => [...items]);
    }
  }

  toggle() {
    this.show.update(show => !show);
  }

  // hasChild(_: number, item: TreeItem) {
  //   return item.children && ((item.children.length > 0) as any);
  // }

  // getParentNode(node: Labels) {
  //   const items = this.items1();
  //   const nodeIndex = items.indexOf(node);

  //   for (let i = nodeIndex - 1; i >= 0; i--) {
  //     if (items[i].level === node.level - 1) {
  //       return items[i];
  //     }
  //   }

  //   return null;
  // }

  // shouldRender(node: TreeItem) {
  //   let parent = this.getParentNode(node);
  //   while (parent) {
  //     if (!parent.isExpanded) {
  //       return false;
  //     }
  //     parent = this.getParentNode(parent);
  //   }
  //   return true;
  // }
}
