import { Directive } from '@angular/core';
import { MeeAutocompleteInput } from '@meeui/adk/autocomplete';

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
