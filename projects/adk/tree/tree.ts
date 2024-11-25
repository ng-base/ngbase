import {
  Component,
  Directive,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  IterableDiffers,
  TemplateRef,
  ViewContainerRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { uniqueId } from '@meeui/adk/utils';
import { MeeTreeNodeDef } from './tree-toggle';

export const TREE_NODE_DATA = new InjectionToken<TreeNodeData<any>>('TREE_NODE_DATA');

export type TreeAction = 'add' | 'addAll' | 'delete' | 'deleteAll';

interface FlatNode {
  expandable: boolean;
  id: string;
  level: number;
  isExpanded?: boolean;
  parentId?: string;
  index: number;
  childrenCount: number;
}

class TreeFlatNode<T> {
  data: FlatNode[] = [];
  readonly dataMap = new Map<string, T>();

  constructor(
    private children: (node: T) => T[],
    private id: (node: T) => any,
  ) {}

  setDataSource(data: T[], opened: Set<string>, expanded: boolean) {
    this.data = [];
    this.dataMap.clear();
    this.setChildren(data, 0, '0', opened, expanded);
  }

  private setChildren(
    list: T[],
    level: number,
    parentId: any,
    opened: Set<string>,
    expanded: boolean,
  ) {
    if (expanded) {
      opened.add(parentId);
    } else if (level !== 0 && !opened.has(parentId)) {
      return;
    }
    for (let index = 0; index < list.length; index++) {
      const node = list[index];
      const children = this.children(node);
      const childrenId = parentId + '-' + this.id(node);
      const value: FlatNode = {
        level,
        expandable: children.length > 0,
        parentId,
        id: childrenId,
        index,
        childrenCount: children.length,
      };
      this.dataMap.set(childrenId, node);
      this.data.push(value);
      if (children.length) {
        this.setChildren(children, level + 1, childrenId, opened, expanded);
      }
    }
  }
}

export interface TreeNodeData<T> {
  level: number;
  details: FlatNode;
  data: T;
}

export interface TreeNodeImplicit<T> {
  $implicit: T;
  level: number;
}

@Component({
  selector: '[meeTree]',
  exportAs: 'meeTree',
  template: `<ng-container #container />`,
  hostDirectives: [AccessibleGroup],
  host: {
    role: 'tree',
  },
})
export class MeeTree<T> {
  // Dependencies
  private readonly injector = inject(Injector);
  private readonly differs = inject(IterableDiffers);
  readonly ayId = uniqueId();

  readonly treeNodeDef = contentChild.required(MeeTreeNodeDef, { read: TemplateRef });
  readonly container = viewChild.required('container', { read: ViewContainerRef });

  // Inputs
  readonly dataSource = input.required<T[]>();
  readonly trackBy = input.required<(index: number, item: T) => any>();
  readonly children = input.required<(node: T) => T[]>();

  readonly opened = signal(new Set<string>());
  readonly trace = new Map<
    string,
    { ref: EmbeddedViewRef<TreeNodeImplicit<T>>; parent: FlatNode }
  >();
  private readonly _dataDiffers = this.differs.find([]).create<FlatNode>((index, item) => item.id);
  private readonly flatner = computed(
    () => new TreeFlatNode(this.children(), node => this.trackBy()(0, node)),
  );
  private expanded = false;

  constructor() {
    inject(AccessibleGroup).ayId.set(this.ayId);
    effect(() => {
      const flatner = this.flatner();
      const data = this.dataSource();
      const opened = this.opened();
      flatner.setDataSource(data, opened, this.expanded);
      this.expanded = false;

      const changes = this._dataDiffers.diff(flatner.data);
      if (!changes) {
        return;
      }

      const container = this.container()!;
      const def = this.treeNodeDef();
      changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
        if (item.previousIndex == null) {
          // Item added
          // const parent = this.flatner().tempData.get(item.item.parentId!);
          this.renderNode(item.item, container, def, item.item.level, currentIndex!);
        } else if (currentIndex == null) {
          // Item removed
          this.removeNode(item.item);
        } else {
          // Item moved
          const viewRef = this.trace.get(item.item.id)?.ref;
          if (viewRef) {
            container.move(viewRef, currentIndex);
          }
        }
      });

      // update the opened nodes
      changes.forEachIdentityChange(item => {
        const viewRef = this.trace.get(item.item.id)?.ref;
        if (viewRef) {
          viewRef.context.level = item.item.level;
          viewRef.context.$implicit = this.flatner().dataMap.get(item.item.id)!;
        }
      });
    });
  }

  private removeNode(data: FlatNode) {
    const ref = this.trace.get(data.id);
    if (ref) {
      ref.ref.destroy();
      this.trace.delete(data.id);
    }
  }

  getNode(id: string) {
    return this.flatner().dataMap.get(id);
  }

  private renderNode(
    details: FlatNode,
    container: ViewContainerRef,
    def: TemplateRef<any>,
    level = 0,
    index: number,
  ) {
    if (!this.trace.has(details.id)) {
      const data = this.flatner().dataMap.get(details.id)!;
      const value: TreeNodeData<T> = { level, details: details, data };
      const injector = Injector.create({
        providers: [{ provide: TREE_NODE_DATA, useValue: value }],
        parent: this.injector,
      });
      const ref = container.createEmbeddedView<TreeNodeImplicit<T>>(
        def,
        { $implicit: data, level },
        { injector, index },
      );
      this.trace.set(details.id, { ref, parent: details });
      ref.detectChanges();
    }
  }

  toggle(data: FlatNode) {
    const opened = this.opened();
    const type = opened.has(data.id) ? 'delete' : 'add';
    if (type === 'delete') {
      opened.delete(data.id);
    } else {
      opened.add(data.id);
    }
    this.opened.set(new Set(opened));
  }

  foldAll() {
    this.expanded = false;
    this.opened.set(new Set());
  }

  expandAll() {
    this.expanded = true;
    this.opened.set(new Set());
  }
}
