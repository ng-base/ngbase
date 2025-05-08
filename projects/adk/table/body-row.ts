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
import { NgbTable, TABLE_ROW_DATA } from './table';

@Directive({ selector: '[ngbBodyRowDef]' })
export class NgbBodyRowDef {
  readonly ngbBodyRowDefColumns = input.required<string[]>();
  context: any;
}

@Directive({
  selector: '[ngbBodyRow]',
})
export class NgbBodyRow implements OnDestroy {
  readonly rowData = inject(TABLE_ROW_DATA);
  readonly table = inject(NgbTable);
  readonly rowDef = inject(NgbBodyRowDef);

  readonly container = viewChild.required('container', { read: ViewContainerRef });
  readonly ref = new Map<NgbColumn, EmbeddedViewRef<any>>();

  constructor() {
    effect(() => {
      const data = this.rowData();
      const columns = this.table.columns();

      const cols = this.rowDef.ngbBodyRowDefColumns();
      columns.forEach(row => {
        const index = cols.indexOf(row.ngbColumn());
        if (index === -1) {
          const ref = this.ref.get(row);
          if (ref) {
            ref.destroy();
            this.ref.delete(row);
          }
          return;
        }
        let ref = this.ref.get(row);
        if (ref) {
          // move the row to the new index
          this.container().move(ref, index);
          ref.context.$implicit = data;
          ref.markForCheck();
          return;
        }

        ref = untracked(() => {
          // maintain the order of the columns
          return this.container().createEmbeddedView(row.cells()!, { $implicit: data }, { index });
        });
        this.ref.set(row, ref);
      });
    });
  }

  ngOnDestroy(): void {
    this.container().clear();
    this.ref.clear();
  }
}

export function aliasBodyRow(row: typeof NgbBodyRow) {
  return { provide: NgbBodyRow, useExisting: row };
}
