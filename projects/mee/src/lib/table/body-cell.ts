import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeCell]',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'p-b align-middle',
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
