import {
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Autocomplete } from './autocomplete.component';

@Directive({
  standalone: true,
  selector: '[meeAutocompleteInput]',
  exportAs: 'meeAutocompleteInput',
  host: {
    class: 'w-full bg-transparent shadow-none outline-none',
    '(focus)': 'onFocus()',
    '(blur)': 'close()',
    '(input)': 'updateSearch($event.target.value)',
    autocomplete: 'off',
  },
})
export class AutocompleteInput<T> {
  readonly autoComplete = inject(Autocomplete);
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly focus = signal(false);
  readonly blur = signal(false);
  readonly meeAutocompleteInput = output<string>();
  readonly search = signal('');
  readonly options = input<T[]>([]);
  readonly filterFn = input<(query: string, value: T, values: T[]) => boolean>();
  readonly filteredOptions = computed(() => {
    const fn = this.filterFn();
    const options = this.options();
    const search = this.search();
    const values = search ? options.filter(v => fn!(search, v, options)) : options;
    console.log(values);
    return values;
  });

  constructor() {
    // afterNextRender(() => {
    // if (this.autoComplete.multiple()) return;
    // this.autoComplete.events.subscribe((event) => {
    //   if (event === 'close') {
    //     const value = this.autoComplete.cValue();
    //     this.el.nativeElement.value = value;
    //   }
    // });
    // });
  }

  onFocus() {
    console.log('Focused');
    this.autoComplete.open();
  }

  close() {
    // this.autoComplete.popClose();
  }

  updateValue(value: string) {
    this.el.nativeElement.value = value;
  }

  updateSearch(value: string) {
    this.search.set(value);
    this.meeAutocompleteInput.emit(value);
  }
}
