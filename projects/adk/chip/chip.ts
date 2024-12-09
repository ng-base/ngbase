import { booleanAttribute, Directive, inject, input, output } from '@angular/core';
import { Directionality } from '@meeui/adk/bidi';

@Directive({
  selector: '[meeChipRemove]',
  host: {
    type: 'button',
    '(click)': 'chip.close.emit()',
    '[attr.data-dir]': 'chip.dir.isRtl() ? "rtl" : "ltr"',
  },
})
export class MeeChipRemove {
  readonly chip = inject(MeeChip<any>);
}

@Directive({
  selector: '[meeChip]',
})
export class MeeChip<T = any> {
  readonly dir = inject(Directionality);

  readonly removable = input(true, { transform: booleanAttribute });
  readonly value = input<T>();
  readonly close = output();
}

export const provideChip = (chip: typeof MeeChip) => [{ provide: MeeChip, useExisting: chip }];
