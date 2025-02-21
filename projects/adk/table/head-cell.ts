import { Directive, inject } from '@angular/core';
import { MeeColumn } from './column';

@Directive({
  selector: '[meeHead]',
  host: {
    '[class]': `column.sticky() === 'start' ? 'sticky left-0 border-r z-10' : column.sticky() === 'end' ? 'sticky right-0 border-l z-10' : ''`,
  },
})
export class MeeHead {
  readonly column = inject(MeeColumn);
  readonly sticky = this.column.sticky;
}

@Directive({
  selector: '[meeHeadDef]',
})
export class MeeHeadDef {}
