import { Directive, inject } from '@angular/core';
import { NgbColumn } from './column';

@Directive({
  selector: '[ngbCell]',
  host: {
    '[class]': `column.sticky() === 'start' ? 'sticky left-0 border-r z-10' : column.sticky() === 'end' ? 'sticky right-0 border-l z-10' : ''`,
  },
})
export class NgbCell {
  readonly column = inject(NgbColumn);
}

@Directive({
  selector: '[ngbCellDef]',
})
export class NgbCellDef {}
