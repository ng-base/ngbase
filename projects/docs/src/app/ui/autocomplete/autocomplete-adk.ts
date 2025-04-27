import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { NgbAutocomplete, NgbAutocompleteInput, aliasAutocomplete } from '@ngbase/adk/autocomplete';
import { NgbSelectOptionGroup } from '@ngbase/adk/select';
import { InputStyle } from '@meeui/ui/form-field';

@Component({
  selector: 'mee-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasAutocomplete(Autocomplete)],
  imports: [InputStyle, NgbSelectOptionGroup],
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
    <ng-template #optionsTemplate>
      <div #optionsGroup ngbSelectOptionGroup class="p-2">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class Autocomplete<T> extends NgbAutocomplete<T> {}

@Directive({
  selector: '[meeAutocompleteInput]',
  exportAs: 'meeAutocompleteInput',
  hostDirectives: [
    {
      directive: NgbAutocompleteInput,
      inputs: ['isChip'],
      outputs: ['ngbAutocompleteInput: meeAutocompleteInput'],
    },
  ],
  host: {
    class: 'w-full bg-transparent shadow-none outline-none',
  },
})
export class AutocompleteInput<T> {}
