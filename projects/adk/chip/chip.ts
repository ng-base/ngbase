import { booleanAttribute, Directive, inject, input, output } from '@angular/core';
import { Directionality } from '@ngbase/adk/bidi';

@Directive({
  selector: '[ngbChipRemove]',
  host: {
    type: 'button',
    '(click)': 'chip.close.emit()',
    '[attr.data-dir]': 'chip.dir.isRtl() ? "rtl" : "ltr"',
  },
})
export class NgbChipRemove {
  readonly chip = inject(NgbChip<any>);
}

@Directive({
  selector: '[ngbChip]',
})
export class NgbChip<T = any> {
  readonly dir = inject(Directionality);

  readonly removable = input(true, { transform: booleanAttribute });
  readonly value = input<T>();
  readonly close = output();
}

export const provideChip = (chip: typeof NgbChip) => [{ provide: NgbChip, useExisting: chip }];
