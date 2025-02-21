import { Directive, inject } from '@angular/core';
import { MeeColumn } from './column';

@Directive({
  selector: '[meeCell]',
  host: {
    '[class]': `column.sticky() === 'start' ? 'sticky left-0 border-r z-10' : column.sticky() === 'end' ? 'sticky right-0 border-l z-10' : ''`,
  },
})
export class MeeCell {
  readonly column = inject(MeeColumn);
}

@Directive({
  selector: '[meeCellDef]',
})
export class MeeCellDef {}
