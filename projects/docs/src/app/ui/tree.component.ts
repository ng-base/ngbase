import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { InlineEdit } from '@meeui/ui/inline-edit';
import { Tree, TreeNode, TreeNodeDef, TreeNodeToggle } from '@meeui/ui/tree';
import { Heading } from '@meeui/ui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronRight } from '@ng-icons/lucide';

class TreeItem {
  currentNow = () => Date.now();
  constructor(
    public id: number,
    public name: string,
    public level: number,
    public isExpanded: boolean,
    public children?: TreeItem[],
  ) {
    // setInterval(() => {
    //   this.currentNow.set(Date.now());
    // }, 500);
  }
}

@Component({
  selector: 'app-tree',
  imports: [
    FormsModule,
    Tree,
    TreeNode,
    TreeNodeDef,
    TreeNodeToggle,
    Heading,
    Button,
    Icon,
    InlineEdit,
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
        #myTree="meeTree"
      >
        <mee-tree-node *meeTreeNodeDef="let item; level as l" #myNode="meeTreeNode">
          <button meeButton variant="ghost" meeTreeNodeToggle class="h-9 w-9 !p-b2">
            <mee-icon
              size="20px"
              [name]="myNode.isOpen() ? 'lucideChevronDown' : 'lucideChevronRight'"
            />
            <!-- {{ myNode.isOpen() ? '▼' : '►' }} -->
          </button>
          <mee-inline-edit [(ngModel)]="item.name" class="bg-transparent" /> {{ item.currentNow() }}
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
    for (let i = 1; i <= 10; i++) {
      const children: TreeItem[] = [];
      // let item: TreeItem = {
      //   id: i,
      //   level: 0,
      //   isExpanded: false,
      //   name: `Item ${i}`,
      //   children,
      // };
      let item = new TreeItem(i, `Item ${i}`, 0, false, children);
      data.push(item);
      items.push(item);
      for (let j = 1; j <= 5; j++) {
        const subChildren: TreeItem[] = [];
        // item = {
        //   id: j,
        //   level: 1,
        //   isExpanded: false,
        //   name: `Child ${j}`,
        //   children: subChildren,
        // };
        item = new TreeItem(j, `Child ${j}`, 1, false, subChildren);
        children.push(item);
        data.push(item);
        for (let k = 1; k <= 2; k++) {
          // item = {
          //   id: k,
          //   level: 2,
          //   isExpanded: false,
          //   name: `Sub Child ${k}`,
          // };
          item = new TreeItem(k, `Sub Child ${k}`, 2, false);
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
    const item = new TreeItem(
      data.children.length + 1,
      `Child ${data.children.length + 1}`,
      data.level + 1,
      false,
    );
    data.children.push(item);
    //   {
    //   id: data.children.length + 1,
    //   level: data.level + 1,
    //   isExpanded: false,
    //   name: `Child ${data.children.length + 1}`,
    // });
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
