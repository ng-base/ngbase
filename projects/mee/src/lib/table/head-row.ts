import {
  Component,
  Directive,
  inject,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  effect,
  EmbeddedViewRef,
} from '@angular/core';
import { ROW_TOKEN, Table } from './table';
import { Row } from './column';

@Component({
  standalone: true,
  selector: '[meeHeadRow]',
  template: `<ng-container #container></ng-container>`,
  host: {
    class: 'bg-foreground',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadRow {
  def = inject(ROW_TOKEN);
  table = inject(Table);
  container = viewChild('container', { read: ViewContainerRef });
  ref = new Map<Row, EmbeddedViewRef<any>>();

  constructor() {
    effect(() => {
      const rows = this.table.rows();
      this.ref.forEach((ref, row) => {
        if (!rows.includes(row)) {
          ref.destroy();
          this.ref.delete(row);
          return;
        }
      });
      rows.forEach((row) => {
        if (!this.ref.has(row)) {
          const ref = this.container()!.createEmbeddedView(row.heads()!);
          this.ref.set(row, ref);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.container()!.clear();
  }
}

@Directive({
  standalone: true,
  selector: '[meeHeadRowDef]',
})
export class HeadRowDef {}
