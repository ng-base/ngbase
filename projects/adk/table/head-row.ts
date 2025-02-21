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
import { MeeColumn } from './column';

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
  ref = new Map<MeeColumn, EmbeddedViewRef<any>>();
  headDef = inject(MeeHeadRowDef);

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
      const cols = this.headDef.meeHeadRowDef();
      columns.forEach(column => {
        if (!cols?.includes(column.meeColumn())) {
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
