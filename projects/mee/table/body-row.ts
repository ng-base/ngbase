import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { NgbBodyRow, NgbBodyRowDef } from '@ngbase/adk/table';

@Directive({
  selector: '[meeBodyRowDef]',
  hostDirectives: [
    { directive: NgbBodyRowDef, inputs: ['ngbBodyRowDefColumns: meeBodyRowDefColumns'] },
  ],
})
export class BodyRowDef {}

@Component({
  selector: '[meeBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NgbBodyRow, useExisting: BodyRow }],
  template: `<ng-container #container />`,
  host: {
    class: '[&:not(:last-child)]:border-b hover:bg-muted-background h-b12',
  },
})
export class BodyRow extends NgbBodyRow {}
