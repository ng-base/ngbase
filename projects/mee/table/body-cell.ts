import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';
import { MeeCell, MeeCellDef } from '@meeui/adk/table';

@Component({
  selector: '[meeCell]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MeeCell],
  host: {
    class: 'px-b4 py-b2 align-middle bg-foreground',
  },
  template: `<ng-content />`,
})
export class Cell {}

@Directive({
  selector: '[meeCellDef]',
  hostDirectives: [MeeCellDef],
})
export class CellDef {}
