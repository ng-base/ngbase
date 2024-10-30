import {
  Component,
  Directive,
  inject,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  effect,
  EmbeddedViewRef,
  input,
  OnDestroy,
} from '@angular/core';
import { ROW_TOKEN, Table } from './table';
import { Row } from './column';

@Component({
  standalone: true,
  selector: '[meeHeadRow]',
  template: `<ng-container #container />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-b10',
    '[class]': `headDef.meeHeadRowDefSticky() ? 'sticky top-0 bg-foreground' : ''`,
  },
})
export class HeadRow implements OnDestroy {
  def = inject(ROW_TOKEN);
  table = inject(Table);
  container = viewChild('container', { read: ViewContainerRef });
  ref = new Map<Row, EmbeddedViewRef<any>>();
  headDef = inject(HeadRowDef);

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
      const cols = this.headDef.meeHeadRowDef();
      rows.forEach(row => {
        if (!cols?.includes(row.meeRow())) {
          if (this.ref.has(row)) {
            const ref = this.ref.get(row);
            ref!.destroy();
            this.ref.delete(row);
          }
          return;
        }
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
export class HeadRowDef {
  meeHeadRowDef = input<string[]>();
  meeHeadRowDefSticky = input();
}
