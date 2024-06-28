import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeCell]',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'px-b4 py-b3 align-middle',
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
