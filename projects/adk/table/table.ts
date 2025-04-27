import {
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
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgbColumn } from './column';

import { NgbBodyRowDef } from './body-row';
import { NgbHeadRowDef } from './head-row';

export const ROW_TOKEN = new InjectionToken<any>('ROW_TOKEN');

@Directive({
  selector: 'table[ngbTable]',
})
export class NgbTable<T> {
  private readonly injector = inject(Injector);
  private readonly differs = inject(IterableDiffers);

  private readonly thead = viewChild('thead', { read: ViewContainerRef });
  private readonly tbody = viewChild('tbody', { read: ViewContainerRef });
  private readonly bodyRowDef = contentChildren(NgbBodyRowDef, { read: TemplateRef });
  private readonly headRowDef = contentChild(NgbHeadRowDef, { read: TemplateRef });
  readonly columns = contentChildren(NgbColumn);

  readonly data = input.required<T[]>();
  readonly trackBy = input<(index: number, item: T) => any>((_, item) => item);

  private _dataDiffers?: IterableDiffer<T>;
  private readonly _values = new WeakMap<EmbeddedViewRef<TableOutletContext<T>>, T>();
  private readonly valuesTracker = new Map<string, any>();

  constructor() {
    let headerRendered = false;
    effect(() => {
      const thead = this.thead()!;
      const tbody = this.tbody()!;
      const headRowDef = this.headRowDef()!;
      const bodyRowDefs = this.bodyRowDef()!;
      const data = this.data();

      this._dataDiffers ??= this.differs.find([]).create(this.trackBy());
      const changes = this._dataDiffers?.diff(data);

      if (!changes) {
        return;
      }

      // append head row
      if (!headerRendered) {
        const value = null;
        const injector = Injector.create({
          providers: [{ provide: ROW_TOKEN, useValue: value }],
          parent: this.injector,
        });
        thead.createEmbeddedView(headRowDef, { $implicit: value }, { injector });
        headerRendered = true;
      }

      const len = bodyRowDefs.length;

      changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
        if (item.previousIndex == null) {
          const value = item.item;
          this.valuesTracker.set(this.trackBy()(currentIndex!, item.item), value);
          const injector = Injector.create({
            providers: [{ provide: ROW_TOKEN, useValue: value }],
            parent: this.injector,
          });
          const i = currentIndex! * len;
          for (let j = 0; j < len; j++) {
            const ref = tbody.createEmbeddedView(
              bodyRowDefs[j],
              { $implicit: value },
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
        const id = this.trackBy()(record.currentIndex!, record.item);
        const value = this.valuesTracker.get(id)!;
        value?.data.set(record.item);
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

export class TableOutletContext<T> {
  $implicit: T;
  index?: number;
  count?: number;
  first?: boolean;
  last?: boolean;
  even?: boolean;
  odd?: boolean;
  constructor(data: T) {
    this.$implicit = data;
  }
}
