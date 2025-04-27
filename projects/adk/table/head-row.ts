import {
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  OnDestroy,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgbColumn } from './column';
import { NgbTable, ROW_TOKEN } from './table';

@Directive({
  selector: '[ngbHeadRowDef]',
})
export class NgbHeadRowDef {
  readonly ngbHeadRowDef = input<string[]>();
  readonly ngbHeadRowDefSticky = input();
}

@Directive({
  selector: '[ngbHeadRow]',
  host: {
    '[attr.data-sticky]': 'headDef.ngbHeadRowDefSticky()',
  },
})
export class NgbHeadRow implements OnDestroy {
  def = inject(ROW_TOKEN);
  table = inject(NgbTable);
  container = viewChild('container', { read: ViewContainerRef });
  ref = new Map<NgbColumn, EmbeddedViewRef<any>>();
  headDef = inject(NgbHeadRowDef);

  constructor() {
    effect(() => {
      const columns = this.table.columns();
      this.ref.forEach((ref, column) => {
        if (!columns.includes(column)) {
          ref.destroy();
          this.ref.delete(column);
          return;
        }
      });
      const cols = this.headDef.ngbHeadRowDef();
      columns.forEach((column, index) => {
        if (!cols?.includes(column.ngbColumn())) {
          if (this.ref.has(column)) {
            const ref = this.ref.get(column);
            ref!.destroy();
            this.ref.delete(column);
          }
          return;
        }
        if (!this.ref.has(column)) {
          // maintain the order of the columns
          const ref = this.container()!.createEmbeddedView(column.heads()!, undefined, {
            index,
          });
          this.ref.set(column, ref);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.container()!.clear();
  }
}
