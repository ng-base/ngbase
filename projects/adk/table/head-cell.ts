import { Directive, inject } from '@angular/core';
import { NgbColumn } from './column';

@Directive({
  selector: '[ngbHead]',
  host: {
    '[attr.data-sticky]': 'column.sticky() || undefined',
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
