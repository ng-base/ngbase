import { Component } from '@angular/core';
// import { Autocomplete } from '@meeui/ui/autocomplete';
import { MeeChipGroup } from '@meeui/adk/chip';

@Component({
  selector: 'mee-chip-group',
  hostDirectives: [MeeChipGroup],
  template: `<ng-content />`,
})
export class ChipGroup<T> {}
