import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeCell]',
  template: `<ng-content />`,
  host: {
    class: 'px-b4 py-b2 align-middle',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cell {
  constructor() {}
}

@Directive({
  standalone: true,
  selector: '[meeCellDef]',
})
export class CellDef {}
