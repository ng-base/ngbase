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
import { ROW_TOKEN, Table } from './table';
import { Row } from './column';

@Component({
  standalone: true,
  selector: '[meeBodyRow]',
  template: `<ng-container #container></ng-container>`,
  host: {
    class: '[&:not(:last-child)]:border-b hover:bg-muted-background h-b12',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRow implements OnDestroy {
  def = inject(ROW_TOKEN);
  table = inject(Table);
  container = viewChild('container', { read: ViewContainerRef });
  ref = new Map<Row, EmbeddedViewRef<any>>();
  rowDef = inject(BodyRowDef);

  constructor() {
    effect(
      () => {
        const data = this.def;
        const rows = this.table.rows();
        // Remove rows that are no longer in the definition
        this.ref.forEach((ref, row) => {
          if (!rows.includes(row)) {
            ref.destroy();
            this.ref.delete(row);
          }
        });

        const cols = this.rowDef.meeBodyRowDefColumns();
        rows.forEach(row => {
          if (!cols?.includes(row.meeRow())) {
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
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    this.container()!.clear();
    this.ref.clear();
  }
}

@Directive({
  standalone: true,
  selector: '[meeBodyRowDef]',
})
export class BodyRowDef {
  context: any;
  meeBodyRowDefColumns = input<string[]>([]);
  constructor() {}
}
