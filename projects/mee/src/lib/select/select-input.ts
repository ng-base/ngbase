import {
  Directive,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { InputStyle } from '@meeui/ui/input';
import { Autofocus } from '@meeui/ui/adk';
import { Select } from './select';

@Directive({
  selector: '[meeSelectInput]',
  hostDirectives: [InputStyle, Autofocus],
  exportAs: 'meeSelectInput',
  host: {
    class: 'w-full !m-0 mb-b !ring-0 !border-0 !border-b rounded-none px-b3 z-10',
    '(input)': 'updateSearch($event.target.value)',
    '[placeholder]': 'placeholder()',
    '[tabindex]': '0',
  },
})
export class SelectInput<T> {
  // Dependencies
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly select = inject<Select<T>>(Select, { optional: true });

  // Inputs
  readonly placeholder = input('Search here');
  readonly meeSelectInput = output<string>();
  readonly options = input<T[]>([]);
  readonly filterFn = input<(query: string, value: T, values: T[]) => boolean>();

  // State
  readonly search = signal<string>('');
  readonly filteredOptions = computed(() => {
    const fn = this.filterFn();
    const options = this.options();
    const search = this.search();
    const values = search ? options.filter(v => fn!(search, v, options)) : options;
    console.log(values);
    return values;
  });

  constructor() {
    this.select?.events.subscribe(event => {
      if (event === 'open') {
        this.search.set('');
        this.el.nativeElement.focus();
      }
    });
  }

  updateSearch(value: string) {
    this.search.set(value);
    this.meeSelectInput.emit(value);
  }
}

@Directive({
  selector: '[meeSelectTrigger]',
})
export class SelectTrigger {}
