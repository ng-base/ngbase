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
import { ROW_TOKEN, MeeTable } from './table';
import { MeeRow } from './column';

@Directive({
  selector: '[meeHeadRowDef]',
})
export class MeeHeadRowDef {
  readonly meeHeadRowDef = input<string[]>();
  readonly meeHeadRowDefSticky = input();
}

@Component({
  selector: '[meeHeadRow]',
  template: `<ng-container #container />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // '[class]': `headDef.meeHeadRowDefSticky() ? 'sticky top-0 bg-foreground' : ''`,
    '[attr.data-sticky]': 'headDef.meeHeadRowDefSticky()',
  },
})
export class MeeHeadRow implements OnDestroy {
  def = inject(ROW_TOKEN);
  table = inject(MeeTable);
  container = viewChild('container', { read: ViewContainerRef });
  ref = new Map<MeeRow, EmbeddedViewRef<any>>();
  headDef = inject(MeeHeadRowDef);

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
