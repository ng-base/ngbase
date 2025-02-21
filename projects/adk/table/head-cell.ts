import { Directive, inject } from '@angular/core';
import { NgbColumn } from './column';

@Directive({
  selector: '[ngbHead]',
  host: {
    '[class]': `column.sticky() === 'start' ? 'sticky left-0 border-r z-10' : column.sticky() === 'end' ? 'sticky right-0 border-l z-10' : ''`,
  },
})
export class NgbHead {
  readonly column = inject(NgbColumn);
  readonly sticky = this.column.sticky;
}

@Directive({
  selector: '[ngbHeadDef]',
})
export class NgbHeadDef {}
