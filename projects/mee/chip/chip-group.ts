import { Component, contentChildren, effect, inject, untracked } from '@angular/core';
// import { Autocomplete } from '@meeui/ui/autocomplete';
import { Chip } from './chip';

@Component({
  selector: 'mee-chip-group',
  template: `<ng-content />`,
})
export class ChipGroup<T> {
  readonly chips = contentChildren(Chip<T>);
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
