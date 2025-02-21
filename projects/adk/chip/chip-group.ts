import { contentChildren, Directive, effect, untracked } from '@angular/core';
// import { Autocomplete } from '@ngbase/adk/autocomplete';
import { NgbChip } from './chip';

@Directive({
  selector: '[ngbChipGroup]',
})
export class NgbChipGroup<T> {
  readonly chips = contentChildren(NgbChip<T>);
  // readonly autoComplete = inject(Autocomplete);

  // constructor() {
  //   effect(() => {
  //     const chips = this.chips();
  //     untracked(() => {
  //       chips.forEach(chip => {
  //         chip.close.subscribe(() => {
  //           this.autoComplete.removeValue(chip.value());
  //         });
  //       });
  //     });
  //   });
  // }
}
