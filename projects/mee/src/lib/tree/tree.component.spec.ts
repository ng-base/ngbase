import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tree } from './tree.component';
import { TreeNodeDef } from './tree-node.directive';
import { Component, signal } from '@angular/core';

// Mock data
interface TestNode {
  id: string;
  name: string;
  children: TestNode[];
}

const mockData: TestNode[] = [
  {
    id: '1',
    name: 'Root',
    children: [
      { id: '2', name: 'Child 1', children: [] },
      {
        id: '3',
        name: 'Child 2',
        children: [{ id: '4', name: 'Grandchild 1', children: [] }],
      },
    ],
  },
];

@Component({
  template: `
    <mee-tree [dataSource]="data()" [trackBy]="trackBy" [children]="getChildren">
      <ng-template meeTreeNodeDef let-node>
        {{ node.name }}
      </ng-template>
    </mee-tree>
  `,
})
class TestHostComponent {
  data = signal(mockData);
  trackBy = (_: number, node: TestNode) => node.id;
  getChildren = (node: TestNode) => node.children;

  deterministicShuffle(nodeId: string) {
    const findAndShuffle = (nodes: TestNode[]): boolean => {
      for (let node of nodes) {
        if (node.id === nodeId) {
          // Deterministic shuffle: reverse the array
          node.children = node.children.reverse();
          return true;
        }
        if (node.children.length && findAndShuffle(node.children)) {
          return true;
        }
      }
      return false;
    };

    findAndShuffle(this.data());
    this.data.update(x => [...x]);
  }
}

describe('Tree', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let treeComponent: Tree<TestNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [Tree, TreeNodeDef],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    treeComponent = fixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(treeComponent).toBeTruthy();
  });

  it('should render root node', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Root');
  });

  it('should expand node on toggle', () => {
    const rootNode = treeComponent['flatner']().data[0];
    treeComponent.toggle(rootNode);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Child 1');
    expect(compiled.textContent).toContain('Child 2');
  });

  it('should collapse expanded node on toggle', () => {
    const rootNode = treeComponent['flatner']().data[0];
    treeComponent.toggle(rootNode); // Expand
    fixture.detectChanges();
    treeComponent.toggle(rootNode); // Collapse
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('Child 1');
    expect(compiled.textContent).not.toContain('Child 2');
  });

  it('should expand all nodes', () => {
    treeComponent.expandAll();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Root');
    expect(compiled.textContent).toContain('Child 1');
    expect(compiled.textContent).toContain('Child 2');
    expect(compiled.textContent).toContain('Grandchild 1');
  });

  it('should collapse all nodes', () => {
    treeComponent.expandAll();
    fixture.detectChanges();
    treeComponent.foldAll();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Root');
    expect(compiled.textContent).not.toContain('Child 1');
    expect(compiled.textContent).not.toContain('Child 2');
    expect(compiled.textContent).not.toContain('Grandchild 1');
  });

  it('should update when data source changes', () => {
    component.data.set([{ id: '5', name: 'New Root', children: [] }]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent.trim()).toContain('New Root');
    expect(compiled.textContent.trim()).not.toBe('Root');
  });

  describe('Children Shuffling', () => {
    it('should update tree when children are shuffled', () => {
      // First, expand the root node
      const rootNode = treeComponent['flatner']().data[0];
      treeComponent.toggle(rootNode);
      fixture.detectChanges();

      // Get the initial order of children
      const initialOrder = fixture.nativeElement.textContent;

      // Shuffle the children of the root node
      component.deterministicShuffle('1');
      fixture.detectChanges();

      // Get the new order of children
      const newOrder = fixture.nativeElement.textContent;

      // The content should be different (note: there's a small chance this could fail if the shuffle doesn't change the order)
      expect(newOrder).not.toBe(initialOrder);

      // But it should still contain all the children
      expect(newOrder).toContain('Child 1');
      expect(newOrder).toContain('Child 2');
    });

    it('should maintain expanded state when children are shuffled', () => {
      // Expand root and Child 2
      const rootNode = treeComponent['flatner']().data[0];
      treeComponent.toggle(rootNode);
      fixture.detectChanges();

      const child2Node = treeComponent['flatner']().data.find(node => node.id.endsWith('-3'));
      treeComponent.toggle(child2Node!);
      fixture.detectChanges();

      // Verify initial state
      expect(fixture.nativeElement.textContent).toContain('Grandchild 1');

      // Shuffle children
      component.deterministicShuffle('1');
      fixture.detectChanges();

      // Verify that Child 2 is still expanded
      expect(fixture.nativeElement.textContent).toContain('Grandchild 1');
    });

    it('should handle shuffling of deeply nested children', () => {
      // Expand all nodes
      treeComponent.expandAll();
      fixture.detectChanges();

      // Shuffle the children of Child 2
      component.deterministicShuffle('3');
      fixture.detectChanges();

      // Verify that the tree still contains all nodes
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('Root');
      expect(content).toContain('Child 1');
      expect(content).toContain('Child 2');
      expect(content).toContain('Grandchild 1');
    });

    it('should handle addition of new children after shuffling', () => {
      // Expand root
      const rootNode = treeComponent['flatner']().data[0];
      treeComponent.toggle(rootNode);
      fixture.detectChanges();

      // Shuffle children
      component.deterministicShuffle('1');

      // Add a new child
      component.data.update(x => {
        x[0].children.push({ id: '5', name: 'New Child', children: [] });
        return [...x];
      });
      fixture.detectChanges();

      // Verify that the new child is rendered
      expect(fixture.nativeElement.textContent).toContain('New Child');
    });
  });
});
