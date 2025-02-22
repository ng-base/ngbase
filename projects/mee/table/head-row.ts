import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { NgbHeadRow, NgbHeadRowDef } from '@ngbase/adk/table';

@Component({
  selector: '[meeHeadRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `h-10 [&[data-sticky=true]]:sticky [&[data-sticky=true]]:top-0 [&[data-sticky=true]]:bg-foreground`,
  },
  providers: [{ provide: NgbHeadRow, useExisting: HeadRow }],
  template: `<ng-container #container />`,
})
export class HeadRow extends NgbHeadRow {}

@Directive({
  selector: '[meeHeadRowDef]',
  hostDirectives: [
    {
      directive: NgbHeadRowDef,
      inputs: ['ngbHeadRowDef: meeHeadRowDef', 'ngbHeadRowDefSticky: meeHeadRowDefSticky'],
    },
  ],
})
export class HeadRowDef {}
