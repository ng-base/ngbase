import { contentChildren, Directive, effect, untracked } from '@angular/core';
// import { Autocomplete } from '@meeui/ui/autocomplete';
import { MeeChip } from './chip';

@Directive({
  selector: '[meeChipGroup]',
})
export class MeeChipGroup<T> {
  readonly chips = contentChildren(MeeChip<T>);
  // readonly autoComplete = inject(Autocomplete);

  constructor() {
    effect(() => {
      const chips = this.chips();
      untracked(() => {
        chips.forEach(chip => {
          chip.close.subscribe(() => {
            // this.autoComplete.removeValue(chip.value());
          });
        });
      });
    });
  }
}
