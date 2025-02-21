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
import { ROW_TOKEN, NgbTable } from './table';
import { NgbColumn } from './column';

@Directive({
  selector: '[ngbHeadRowDef]',
})
export class NgbHeadRowDef {
  readonly ngbHeadRowDef = input<string[]>();
  readonly ngbHeadRowDefSticky = input();
}

@Component({
  selector: '[ngbHeadRow]',
  template: `<ng-container #container />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // '[class]': `headDef.ngbHeadRowDefSticky() ? 'sticky top-0 bg-foreground' : ''`,
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
      columns.forEach(column => {
        if (!cols?.includes(column.ngbColumn())) {
          if (this.ref.has(column)) {
            const ref = this.ref.get(column);
            ref!.destroy();
            this.ref.delete(column);
          }
          return;
        }
        if (!this.ref.has(column)) {
          const ref = this.container()!.createEmbeddedView(column.heads()!);
          this.ref.set(column, ref);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.container()!.clear();
  }
}
