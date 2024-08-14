import {
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Select } from './select.component';
import { InputStyle } from '../input/input-style.directive';

@Directive({
  standalone: true,
  selector: '[meeSelectInput]',
  hostDirectives: [InputStyle],
  exportAs: 'meeSelectInput',
  host: {
    class: 'w-full mb-b !ring-0 border-b rounded-none px-b2 sticky top-0 z-10 !-m-b0.5',
    '(input)': 'updateSearch($event.target.value)',
    '[placeholder]': 'placeholder()',
    '[tabindex]': '0',
  },
})
export class SelectInput<T> {
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  select = inject(Select, { optional: true });
  search = signal<string>('');
  placeholder = input('Search here');
  meeSelectInput = output<string>();
  options = input<T[]>([]);
  filterFn = input<(query: string, value: T, values: T[]) => boolean>();
  filteredOptions = computed(() => {
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
  standalone: true,
  selector: '[meeSelectTrigger]',
})
export class SelectTrigger {}
