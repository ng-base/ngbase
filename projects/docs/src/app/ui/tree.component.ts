import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Icons } from '@meeui/icon';
import { Tree, TreeNode, TreeNodeContent, TreeNodeDef, TreeNodeToggle } from '@meeui/tree';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronRight } from '@ng-icons/lucide';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';

interface TreeItem {
  id: number;
  name: string;
  level: number;
  isExpanded: boolean;
  children?: TreeItem[];
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
    this.items.update(items => [...items]);
  }

  deleteItem(data: TreeItem, parent: TreeItem) {
    // const parent = this.getParentNode(data);
    if (parent) {
      parent.children = parent.children?.filter(item => item !== data);
      this.items.update(items => [...items]);
    }
  }

  toggle() {
    this.show.update(show => !show);
  }
}
