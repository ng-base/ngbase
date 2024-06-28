import {
  Component,
  contentChildren,
  contentChild,
  TemplateRef,
  afterNextRender,
  input,
  viewChild,
  ChangeDetectionStrategy,
  ViewContainerRef,
  Injector,
  inject,
  InjectionToken,
  IterableDiffers,
  IterableDiffer,
  effect,
  EmbeddedViewRef,
  WritableSignal,
  signal,
  untracked,
} from '@angular/core';
import { Row } from './column';
import { NgFor, NgTemplateOutlet } from '@angular/common';

import { BodyRow, BodyRowDef } from './body-row';
import { HeadRow, HeadRowDef } from './head-row';

export interface Column {
  data: WritableSignal<any>;
}

export const ROW_TOKEN = new InjectionToken<Column>('ROW_TOKEN');

@Component({
  standalone: true,
  imports: [NgFor, NgTemplateOutlet],
  selector: 'table[meeTable]',
  template: `
    <thead>
      <ng-container #thead></ng-container>
    </thead>
    <tbody>
      <ng-container #tbody></ng-container>
    </tbody>
  `,
  host: {
    class: 'w-full text-sm',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T> {
  thead = viewChild('thead', { read: ViewContainerRef });
  tbody = viewChild('tbody', { read: ViewContainerRef });
  bodyRowDef = contentChild(BodyRowDef, { read: TemplateRef });
  headRowDef = contentChild(HeadRowDef, { read: TemplateRef });
  rows = contentChildren(Row);
  bodyRow = contentChild(BodyRow);
  headRow = contentChild(HeadRow);
  data = input.required<T[]>();
  trackBy = input<(index: number, item: T) => any>((_, item) => item);
  injector = inject(Injector);
  differs = inject(IterableDiffers);
  _dataDiffers?: IterableDiffer<T>;
  _values = new WeakMap<EmbeddedViewRef<T>, T>();
  valuesTracker = new Map<string, Column>();

  constructor() {
    afterNextRender(() => {
      this._dataDiffers = this.differs.find([]).create(this.trackBy);
    });

    let headerRendered = false;
    effect(
      () => {
        const thead = this.thead()!;
        const tbody = this.tbody()!;
        const headRowDef = this.headRowDef()!;
        const bodyRowDef = this.bodyRowDef()!;
        const data = this.data();

        const changes = this._dataDiffers?.diff(data);

        if (!changes) {
          return;
        }

        // append head row
        if (!headerRendered) {
          const value: Column = { data: signal(null) };
          const injector = Injector.create({
            providers: [{ provide: ROW_TOKEN, useValue: value }],
            parent: this.injector,
          });
          thead.createEmbeddedView(headRowDef, { $implicit: value }, { injector });
          headerRendered = true;
        }

        changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
          if (item.previousIndex == null) {
            const value: Column = {
              data: signal(item.item),
            };
            this.valuesTracker.set(this.trackBy()(currentIndex!, item.item), value);
            const injector = Injector.create({
              providers: [{ provide: ROW_TOKEN, useValue: value }],
              parent: this.injector,
            });
            const ref = tbody.createEmbeddedView(
              bodyRowDef,
              { $implicit: value },
              { injector, index: currentIndex! },
            );
            this._values.set(ref, item.item);
          } else if (currentIndex == null) {
            tbody.remove(adjustedPreviousIndex!);
          } else {
            const view = tbody.get(adjustedPreviousIndex!);
            tbody.move(view!, currentIndex!);
          }
        });

        // update rows
        changes.forEachIdentityChange((record) => {
          const id = this.trackBy()(record.currentIndex!, record.item);
          const value = this.valuesTracker.get(id)!;
          value.data.set(record.item);
        });

        // console.log('changes', this._values);
      },
      { allowSignalWrites: true },
    );
  }
}
