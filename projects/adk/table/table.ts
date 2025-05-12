import {
  computed,
  contentChild,
  contentChildren,
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  InjectionToken,
  Injector,
  input,
  IterableDiffer,
  IterableDiffers,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { NgbColumn } from './column';

import { NgbBodyRowDef } from './body-row';
import { NgbHeadRowDef } from './head-row';

export const TABLE_ROW_DATA = new InjectionToken<WritableSignal<any>>('TABLE_ROW_DATA');

@Directive({
  selector: 'table[ngbTable]',
})
export class NgbTable<T> {
  private readonly injector = inject(Injector);
  private readonly differs = inject(IterableDiffers);

  private readonly thead = viewChild.required('thead', { read: ViewContainerRef });
  private readonly tbody = viewChild.required('tbody', { read: ViewContainerRef });
  private readonly bodyRowDef = contentChildren(NgbBodyRowDef, { read: TemplateRef });
  private readonly headRowDef = contentChild.required(NgbHeadRowDef, { read: TemplateRef });
  readonly columns = contentChildren(NgbColumn);

  readonly plugins = signal<Set<(data: T[]) => T[]>>(new Set());
  readonly data = input.required<T[]>();
  readonly trackBy = input<(index: number, item: T) => any>((_, item) => item);

  private readonly pluggedData = computed(() => {
    return Array.from(this.plugins()).reduce((acc, plugin) => plugin(acc), this.data());
  });
  private _dataDiffers?: IterableDiffer<T>;
  private readonly _values = new WeakMap<EmbeddedViewRef<TableOutletContext<T>>, T>();

  constructor() {
    effect(cleanup => {
      const headRowDef = this.headRowDef();
      const thead = this.thead();

      // append head row
      const injector = Injector.create({ providers: [], parent: this.injector });
      thead.createEmbeddedView(headRowDef, {}, { injector });
      cleanup(() => thead.clear());
    });

    effect(() => {
      const tbody = this.tbody()!;
      const bodyRowDefs = this.bodyRowDef();
      const data = this.pluggedData();

      this._dataDiffers ??= this.differs.find([]).create(this.trackBy());
      const changes = this._dataDiffers?.diff(data);

      if (!changes) {
        return;
      }

      const len = bodyRowDefs.length;

      changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
        if (item.previousIndex == null) {
          const value = item.item;
          const data = signal(value);
          const injector = Injector.create({
            providers: [{ provide: TABLE_ROW_DATA, useValue: data }],
            parent: this.injector,
          });
          const i = currentIndex! * len;
          for (let j = 0; j < len; j++) {
            const ref = tbody.createEmbeddedView(
              bodyRowDefs[j],
              { $implicit: value, _data: data },
              { injector, index: i + j },
            );
            this._values.set(ref, item.item);
          }
        } else if (currentIndex == null) {
          for (let i = 0; i < len; i++) {
            const ref = tbody.get(adjustedPreviousIndex! * len);
            ref?.destroy();
          }
          // tbody.remove(adjustedPreviousIndex!);
        } else {
          // based on current and previous index we need to check whether we need to do 1 or -1
          for (let i = 0; i < len; i++) {
            const ref = tbody.get(adjustedPreviousIndex! * len + i);
            tbody.move(ref!, currentIndex! * len + i);
          }
        }
      });

      // update rows
      changes.forEachIdentityChange(record => {
        const ref = tbody.get(record.currentIndex!) as any;
        if (ref) {
          const context = ref.context as TableOutletContext<T>;
          context._data.set(record.item);
        }
      });

      this._updateItemIndexContext();
    });
  }

  private _updateItemIndexContext() {
    const viewContainer = this.tbody()!;
    for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
      const viewRef = viewContainer.get(renderIndex) as any;
      const context = viewRef.context as TableOutletContext<T>;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      context.index = renderIndex;
    }
  }
}

export function aliasTable(table: typeof NgbTable) {
  return { provide: NgbTable, useExisting: table };
}

export class TableOutletContext<T> {
  _data: WritableSignal<T>;
  $implicit: T;
  index?: number;
  count?: number;
  first?: boolean;
  last?: boolean;
  even?: boolean;
  odd?: boolean;
  constructor(data: T) {
    this.$implicit = data;
    this._data = signal(data);
  }
}
