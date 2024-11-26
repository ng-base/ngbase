import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MeeBodyRow, MeeBodyRowDef } from '@meeui/adk/table';

@Directive({
  selector: '[meeBodyRowDef]',
  hostDirectives: [{ directive: MeeBodyRowDef, inputs: ['meeBodyRowDefColumns'] }],
})
export class BodyRowDef {}

@Component({
  selector: '[meeBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: '[&:not(:last-child)]:border-b hover:bg-muted-background h-b12',
  },
  providers: [{ provide: MeeBodyRow, useExisting: BodyRow }],
  template: `<ng-container #container />`,
})
export class BodyRow extends MeeBodyRow {}
