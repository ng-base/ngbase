import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MeeHeadRow, MeeHeadRowDef } from '@meeui/adk/table';

@Component({
  selector: '[meeHeadRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `h-b10 [&[data-sticky=true]]:sticky [&[data-sticky=true]]:top-0 [&[data-sticky=true]]:bg-foreground`,
  },
  providers: [{ provide: MeeHeadRow, useExisting: HeadRow }],
  template: `<ng-container #container />`,
})
export class HeadRow extends MeeHeadRow {}

@Directive({
  selector: '[meeHeadRowDef]',
  hostDirectives: [{ directive: MeeHeadRowDef, inputs: ['meeHeadRowDef', 'meeHeadRowDefSticky'] }],
})
export class HeadRowDef {}
