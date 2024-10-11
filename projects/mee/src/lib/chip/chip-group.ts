import { Component, contentChildren, effect, inject, untracked } from '@angular/core';
import { Chip } from './chip';
import { Autocomplete } from '../autocomplete';

@Component({
  standalone: true,
  imports: [],
  selector: 'mee-chip-group',
  template: `<ng-content></ng-content>`,
})
export class ChipGroup<T> {
  readonly chips = contentChildren(Chip<T>);
  readonly autoComplete = inject(Autocomplete);

  constructor() {
    effect(() => {
      const chips = this.chips();
      untracked(() => {
        chips.forEach(chip => {
          chip.close.subscribe(() => {
            this.autoComplete.removeValue(chip.value());
          });
        });
      });
    });
  }
}
