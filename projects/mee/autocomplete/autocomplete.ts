import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  effect,
} from '@angular/core';
import { AccessibleGroup } from '@meeui/ui/a11y';
import { Chip } from '@meeui/ui/chip';
import { InputStyle } from '@meeui/ui/input';
import { SelectBase } from '@meeui/ui/select';
import { provideValueAccessor } from '@meeui/ui/utils';
import { AutocompleteInput } from './autocomplete-input';

@Component({
  selector: 'mee-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputStyle, AccessibleGroup],
  template: `
    <ul
      #container
      meeInputStyle
      class="readonly !flex w-full flex-wrap gap-2"
      (click)="prevent($event)"
    >
      <ng-content select="mee-chip, mee-chip-group" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #options>
      <div #optionsGroup meeAccessibleGroup [ayId]="ayid" [isPopup]="true" class="p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'inline-flex',
  },
  providers: [provideValueAccessor(Autocomplete)],
})
export class Autocomplete<T> extends SelectBase<T> {
  searchInput = contentChild(AutocompleteInput);
  chips = contentChildren(Chip);

  constructor() {
    super(false);
    effect(() => {
      if (this.status() !== 'opened') this.updateInputValue();
    });
  }

  prevent(ev: MouseEvent) {
    ev.stopPropagation();
  }

  private updateInputValue() {
    const searchInput = this.searchInput();
    if (!this.chips()?.length && searchInput) {
      searchInput.meeAutocompleteInput.emit('');
      searchInput.updateValue(this.cValue());
    }
  }
}
