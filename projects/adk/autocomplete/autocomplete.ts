import {
  computed,
  contentChild,
  contentChildren,
  Directive,
  effect,
  input,
  Type,
} from '@angular/core';
import { NgbChip } from '@ngbase/adk/chip';
import { SelectBase } from '@ngbase/adk/select';
import { filterFunction, FilterOptions, provideValueAccessor } from '@ngbase/adk/utils';
import { NgbAutocompleteInput } from './autocomplete-input';

@Directive({
  selector: '[ngbAutocomplete]',
  providers: [_provide(NgbAutocomplete)],
})
export class NgbAutocomplete<T> extends SelectBase<T> {
  readonly searchInput = contentChild(NgbAutocompleteInput);
  readonly chips = contentChildren(NgbChip);
  readonly filterFn = input((option: string) => option as string);
  readonly queryFn = input<(query: string, option: any) => boolean>();
  readonly filterOptions = input<FilterOptions<T>>();
  readonly optionsFilter = filterFunction(
    this.options,
    computed(
      () =>
        this.filterOptions() ??
        ({ filter: this.filterFn(), query: this.queryFn() } as FilterOptions<T>),
    ),
  );

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
      searchInput.ngbAutocompleteInput.emit('');
      searchInput.updateValue(this.cValue());
    }
  }
}

function _provide<T>(autocomplete: Type<NgbAutocomplete<T>>) {
  return [{ provide: SelectBase, useExisting: autocomplete }, provideValueAccessor(autocomplete)];
}

export function aliasAutocomplete<T>(autocomplete: Type<NgbAutocomplete<T>>) {
  const deps = [_provide(autocomplete), { provide: NgbAutocomplete, useExisting: autocomplete }];
  return deps;
}
