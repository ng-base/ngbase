import {
  Component,
  Directive,
  inject,
  viewChild,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectionStrategy,
  effect,
  EmbeddedViewRef,
  input,
  untracked,
} from '@angular/core';
import { ROW_TOKEN, NgbTable } from './table';
import { NgbColumn } from './column';

@Directive({ selector: '[ngbBodyRowDef]' })
export class NgbBodyRowDef {
  readonly ngbBodyRowDefColumns = input<string[]>([]);
  context: any;
}

@Component({
  selector: '[ngbBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container />`,
})
export class NgbBodyRow implements OnDestroy {
  readonly def = inject(ROW_TOKEN);
  readonly table = inject(NgbTable);
  readonly rowDef = inject(NgbBodyRowDef);

  readonly container = viewChild('container', { read: ViewContainerRef });
  readonly ref = new Map<NgbColumn, EmbeddedViewRef<any>>();

  constructor() {
    effect(() => {
      const data = this.def;
      const rows = this.table.columns();
      // Remove rows that are no longer in the definition
      this.ref.forEach((ref, row) => {
        if (!rows.includes(row)) {
          ref.destroy();
          this.ref.delete(row);
        }
      });

      const cols = this.rowDef.ngbBodyRowDefColumns();
      rows.forEach(row => {
        if (!cols?.includes(row.ngbColumn())) {
          if (this.ref.has(row)) {
            const ref = this.ref.get(row);
            ref!.destroy();
            this.ref.delete(row);
          }
          return;
        }
        if (this.ref.has(row)) {
          const ref = this.ref.get(row);
          ref!.context.$implicit = data;
          ref!.markForCheck();
          return;
        }

        const ref = untracked(() => {
          return this.container()!.createEmbeddedView(row.cells()!, {
            $implicit: data,
          });
        });
        this.ref.set(row, ref);
      });
    });
  }

  ngOnDestroy(): void {
    this.container()!.clear();
    this.ref.clear();
  }
}
