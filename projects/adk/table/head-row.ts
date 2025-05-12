import {
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  OnDestroy,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgbColumn } from './column';
import { NgbTable } from './table';

@Directive({
  selector: '[ngbHeadRowDef]',
})
export class NgbHeadRowDef {
  readonly ngbHeadRowDef = input.required<string[]>();
  readonly ngbHeadRowDefSticky = input();
}

@Directive({
  selector: '[ngbHeadRow]',
  host: {
    '[attr.data-sticky]': 'headDef.ngbHeadRowDefSticky() || undefined',
  },
})
export class NgbHeadRow implements OnDestroy {
  readonly headDef = inject(NgbHeadRowDef);
  readonly table = inject(NgbTable);
  readonly container = viewChild.required('container', { read: ViewContainerRef });
  readonly ref = new Map<NgbColumn, EmbeddedViewRef<any>>();

  constructor() {
    effect(() => {
      const columns = this.table.columns();
      const displayColumns = this.headDef.ngbHeadRowDef();
      columns.forEach(column => {
        const index = displayColumns.indexOf(column.ngbColumn());
        if (index === -1) {
          const ref = this.ref.get(column);
          if (ref) {
            ref.destroy();
            this.ref.delete(column);
          }
          return;
        }
        if (!this.ref.has(column)) {
          // maintain the order of the columns
          const ref = untracked(() =>
            this.container().createEmbeddedView(column.heads()!, undefined, { index }),
          );
          this.ref.set(column, ref);
        } else {
          const ref = this.ref.get(column);
          this.container().move(ref!, index);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.container().clear();
  }
}

export function aliasHeadRow(headRow: typeof NgbHeadRow) {
  return { provide: NgbHeadRow, useExisting: headRow };
}
