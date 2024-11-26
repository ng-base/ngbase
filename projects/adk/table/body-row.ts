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
import { ROW_TOKEN, MeeTable } from './table';
import { MeeRow } from './column';

@Directive({ selector: '[meeBodyRowDef]' })
export class MeeBodyRowDef {
  readonly meeBodyRowDefColumns = input<string[]>([]);
  context: any;
}

@Component({
  selector: '[meeBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container />`,
})
export class MeeBodyRow implements OnDestroy {
  readonly def = inject(ROW_TOKEN);
  readonly table = inject(MeeTable);
  readonly rowDef = inject(MeeBodyRowDef);

  readonly container = viewChild('container', { read: ViewContainerRef });
  readonly ref = new Map<MeeRow, EmbeddedViewRef<any>>();

  constructor() {
    effect(() => {
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
    });
  }

  ngOnDestroy(): void {
    this.container()!.clear();
    this.ref.clear();
  }
}
