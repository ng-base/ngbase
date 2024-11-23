import {
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { InputBase } from '@meeui/adk/input';
import { Autocomplete } from './autocomplete';

@Directive({
  selector: '[meeAutocompleteInput]',
  exportAs: 'meeAutocompleteInput',
  host: {
    class: 'w-full bg-transparent shadow-none outline-none',
    '(focus)': 'onFocus()',
    '(blur)': 'close()',
    '(input)': 'updateSearch($event.target.value)',
    autocomplete: 'off',
  },
  hostDirectives: [{ directive: InputBase, inputs: ['value'] }],
})
export class AutocompleteInput<T> {
  // Dependencies
  readonly autoComplete = inject(Autocomplete);
  readonly input = inject(InputBase);
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  // Inputs
  readonly meeAutocompleteInput = output<string>();
  readonly options = input<T[]>([]);
  readonly filterFn = input<(query: string, value: T, values: T[]) => boolean>();

  // State
  readonly filteredOptions = computed(() => {
    const fn = this.filterFn();
    const options = this.options();
    const search = this.input.value();
    const values = search ? options.filter(v => fn!(search, v, options)) : options;
    return values;
  });

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.addEventListener('keydown', event => {
        if (event.key === 'Backspace' && this.input.value() === '') {
          this.autoComplete.popValue();
        }
      });
      // if (this.autoComplete.multiple()) return;
      // this.autoComplete.events.subscribe((event) => {
      //   if (event === 'close') {
      //     const value = this.autoComplete.cValue();
      //     this.el.nativeElement.value = value;
      //   }
      // });
    });
  }

  onFocus() {
    this.autoComplete.open();
  }

  close() {
    // this.autoComplete.popClose();
  }

  updateValue(value: string) {
    this.el.nativeElement.value = value;
  }

  updateSearch(value: string) {
    this.input.setValue(value);
    this.meeAutocompleteInput.emit(value);
  }
}
