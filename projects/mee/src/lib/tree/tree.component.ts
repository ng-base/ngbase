import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  IterableDiffer,
  IterableDiffers,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { TreeNodeDef } from './tree-node.directive';

export const TREE_NODE_DATA = new InjectionToken<TreeNodeData<any>>('TREE_NODE_DATA');

export type TreeAction = 'add' | 'addAll' | 'delete' | 'deleteAll';

export interface TreeNodeData<T> {
  level: number;
  data: T;
}

export interface TreeNodeImplicit<T> {
  $implicit: T;
  level: number;
}

@Component({
  standalone: true,
  selector: 'mee-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container></ng-container>`,
  host: {
    class: 'block',
  },
})
export class Tree<T> {
  dataSource = input.required<T[]>();
  injector = inject(Injector);
  treeNodeDef = contentChild.required(TreeNodeDef, { read: TemplateRef });
  container = viewChild.required('container', { read: ViewContainerRef });
  opened = signal(new Set<T>());
  trace = new Map<T, { ref: EmbeddedViewRef<TreeNodeImplicit<T>>; parent: T }>();
  expanded = input<boolean>(false);
  differs = inject(IterableDiffers);
  _dataDiffers?: IterableDiffer<T>;
  trackBy = input.required<(index: number, item: T) => any>();
  children = input.required<(node: T) => T[]>();

  constructor() {
    afterNextRender(() => {
      this._dataDiffers = this.differs.find([]).create(this.trackBy);
    });
    let firstLoad = true;
    effect(() => {
      const def = this.treeNodeDef();
      const data = this.dataSource();
      const container = this.container();
      const opened = untracked(this.opened);
      const expanded = untracked(this.expanded);
      container.clear();
      this.trace.clear();
      console.log('effect called', data);
      // console.log('effect called');

      // const changes = this._dataDiffers?.diff(data);

      // if (!changes) {
      //   return;
      // }
      let index = 0;
      for (const item of data) {
        const i = this.renderNode(
          item,
          container,
          def,
          0,
          opened,
          expanded && firstLoad ? 'addAll' : 'toggle',
          index,
        );
        // this is because the index is not updated in the renderNode function
        // when expanded is false
        if (i === index) {
          index++;
        }
      }
      firstLoad = false;
    });
  }

  private renderNode(
    data: T,
    container: ViewContainerRef,
    def: TemplateRef<any>,
    level = 0,
    opened: Set<T>,
    type: 'add' | 'addAll' | 'delete' | 'toggle' = 'toggle',
    index: number,
  ): number {
    if (!this.trace.has(data)) {
      const value: TreeNodeData<T> = { level, data };
      const injector = Injector.create({
        providers: [{ provide: TREE_NODE_DATA, useValue: value }],
        parent: this.injector,
      });
      const ref = container.createEmbeddedView<TreeNodeImplicit<T>>(
        def,
        { $implicit: data, level },
        { injector, index },
      );
      this.trace.set(data, { ref, parent: data });
    }
    const children = this.children()(data);
    if (opened.has(data) || type === 'addAll') {
      if (children) {
        opened.add(data);
        for (let i = 0; i < children.length; i++) {
          const item = children[i];
          index++;

          index = this.renderNode(item, container, def, level + 1, opened, type, index);
        }
      }
    }
    return index;
  }

  toggle(data: T) {
    const opened = this.opened();
    const type = opened.has(data) ? 'delete' : 'add';
    if (type === 'delete') {
      opened.delete(data);
    }
    // type === 'add' || type === 'addAll' || (type === 'delete' ? false : !opened.has(data));
    this.process(data, opened, type);
    this.opened.set(new Set(opened));
  }

  process(data: T, opened: Set<T>, type: TreeAction) {
    const isAdd = type === 'add' || type === 'addAll';
    const ref = this.trace.get(data)!;
    if (!ref) {
      return;
    }
    let indexNumber = this.container().indexOf(ref.ref);
    const container = this.container();
    const def = this.treeNodeDef();

    // render the tree
    const children = this.children()(data);
    for (let i = 0; i < children?.length; i++) {
      const item = children[i];
      if (isAdd) {
        indexNumber = this.renderNode(
          item,
          container,
          def,
          ref.ref.context.level + 1,
          opened,
          type,
          indexNumber + 1,
        );
      } else {
        this.deleteNode(item, opened, type);
      }
    }
    if (isAdd) {
      opened.add(data);
    } else if (type === 'deleteAll') {
      opened.delete(data);
    }
  }

  private deleteNode(item: T, opened: Set<T>, type: TreeAction) {
    const ref = this.trace.get(item);
    if (!ref) {
      return;
    }
    if (this.children()(item)) {
      this.process(item, opened, type);
    }
    ref.ref.destroy();
    this.trace.delete(item);
  }

  foldAll() {
    const opened = this.opened();
    while (opened.size) {
      const data = opened.values().next().value;
      this.process(data, opened, 'deleteAll');
    }
    this.opened.set(new Set());
  }

  expandAll() {
    const opened = this.opened();
    const data = this.dataSource();
    for (const item of data) {
      this.process(item, opened, 'addAll');
    }
    this.opened.set(new Set(opened));
  }
}
