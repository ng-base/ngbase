import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeAutocomplete,
  MeeAutocompleteInput,
  provideAutocomplete,
} from '@meeui/adk/autocomplete';
import { MeeSelectOptionGroup } from '@meeui/adk/select';

@Component({
  selector: 'mee-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideAutocomplete(Autocomplete)],
  imports: [MeeSelectOptionGroup],
  template: `
    <ul #container class="readonly !flex w-full flex-wrap gap-2" (click)="prevent($event)">
      <ng-content select="mee-chip, mee-chip-group" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #optionsTemplate>
      <div #optionsGroup meeSelectOptionGroup class="p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class Autocomplete<T> extends MeeAutocomplete<T> {}

@Directive({
  selector: '[meeAutocompleteInput]',
  exportAs: 'meeAutocompleteInput',
  hostDirectives: [
    {
      directive: MeeAutocompleteInput,
      inputs: ['options', 'filterFn'],
      outputs: ['meeAutocompleteInput'],
    },
  ],
  host: {
    class: 'w-full bg-transparent shadow-none outline-none',
  },
})
export class AutocompleteInput<T> {}
