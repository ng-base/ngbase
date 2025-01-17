import { Component, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeTree } from './tree';
import { MeeTreeNodeDef } from './tree-toggle';

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
  imports: [MeeTree, MeeTreeNodeDef],
  template: `
    <div meeTree [dataSource]="data()" [trackBy]="trackBy" [children]="getChildren">
      <ng-template meeTreeNodeDef let-node>
        {{ node.name }}
      </ng-template>
    </div>
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
  let view: RenderResult<TestHostComponent>;
  let treeComponent: MeeTree<TestNode>;

  beforeEach(async () => {
    view = await render(TestHostComponent);
    component = view.host;
    view.detectChanges();
    treeComponent = view.viewChild(MeeTree<TestNode>);
  });

  function textContent() {
    return view.fixture.nativeElement.textContent as string;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(treeComponent).toBeTruthy();
  });

  it('should render root node', () => {
    expect(textContent()).toContain('Root');
  });

  it('should expand node on toggle', () => {
    const rootNode = treeComponent['flattener']().data[0];
    treeComponent.toggle(rootNode);
    view.detectChanges();

    expect(textContent()).toContain('Child 1');
    expect(textContent()).toContain('Child 2');
  });

  it('should collapse expanded node on toggle', () => {
    const rootNode = treeComponent['flattener']().data[0];
    treeComponent.toggle(rootNode); // Expand
    view.detectChanges();
    treeComponent.toggle(rootNode); // Collapse
    view.detectChanges();

    expect(textContent()).not.toContain('Child 1');
    expect(textContent()).not.toContain('Child 2');
  });

  it('should expand all nodes', () => {
    treeComponent.expandAll();
    view.detectChanges();

    expect(textContent()).toContain('Root');
    expect(textContent()).toContain('Child 1');
    expect(textContent()).toContain('Child 2');
    expect(textContent()).toContain('Grandchild 1');
  });

  it('should collapse all nodes', () => {
    treeComponent.expandAll();
    view.detectChanges();
    treeComponent.foldAll();
    view.detectChanges();

    expect(textContent()).toContain('Root');
    expect(textContent()).not.toContain('Child 1');
    expect(textContent()).not.toContain('Child 2');
    expect(textContent()).not.toContain('Grandchild 1');
  });

  it('should update when data source changes', () => {
    component.data.set([{ id: '5', name: 'New Root', children: [] }]);
    view.detectChanges();

    expect(textContent().trim()).toContain('New Root');
    expect(textContent().trim()).not.toBe('Root');
  });

  describe('Children Shuffling', () => {
    it('should update tree when children are shuffled', () => {
      // First, expand the root node
      const rootNode = treeComponent['flattener']().data[0];
      treeComponent.toggle(rootNode);
      view.detectChanges();

      // Get the initial order of children
      const initialOrder = textContent();

      // Shuffle the children of the root node
      component.deterministicShuffle('1');
      view.detectChanges();

      // Get the new order of children
      const newOrder = textContent();

      // The content should be different (note: there's a small chance this could fail if the shuffle doesn't change the order)
      expect(newOrder).not.toBe(initialOrder);

      // But it should still contain all the children
      expect(newOrder).toContain('Child 1');
      expect(newOrder).toContain('Child 2');
    });

    it('should maintain expanded state when children are shuffled', () => {
      // Expand root and Child 2
      const rootNode = treeComponent['flattener']().data[0];
      treeComponent.toggle(rootNode);
      view.detectChanges();

      const child2Node = treeComponent['flattener']().data.find(node => node.id.endsWith('-3'));
      treeComponent.toggle(child2Node!);
      view.detectChanges();

      // Verify initial state
      expect(textContent()).toContain('Grandchild 1');

      // Shuffle children
      component.deterministicShuffle('1');
      view.detectChanges();

      // Verify that Child 2 is still expanded
      expect(textContent()).toContain('Grandchild 1');
    });

    it('should handle shuffling of deeply nested children', () => {
      // Expand all nodes
      treeComponent.expandAll();
      view.detectChanges();

      // Shuffle the children of Child 2
      component.deterministicShuffle('3');
      view.detectChanges();

      // Verify that the tree still contains all nodes
      const content = textContent();
      expect(content).toContain('Root');
      expect(content).toContain('Child 1');
      expect(content).toContain('Child 2');
      expect(content).toContain('Grandchild 1');
    });

    it('should handle addition of new children after shuffling', () => {
      // Expand root
      const rootNode = treeComponent['flattener']().data[0];
      treeComponent.toggle(rootNode);
      view.detectChanges();

      // Shuffle children
      component.deterministicShuffle('1');

      // Add a new child
      component.data.update(x => {
        x[0].children.push({ id: '5', name: 'New Child', children: [] });
        return [...x];
      });
      view.detectChanges();

      // Verify that the new child is rendered
      expect(textContent()).toContain('New Child');
    });
  });
});
