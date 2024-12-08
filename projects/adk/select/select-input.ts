import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { Autofocus } from '@meeui/adk/a11y';
import { InputBase } from '@meeui/adk/input';
import { MeeSelect } from './select';

@Directive({
  selector: '[meeSelectInput]',
  exportAs: 'meeSelectInput',
  hostDirectives: [
    Autofocus,
    { directive: InputBase, inputs: ['value'], outputs: ['valueChange'] },
  ],
  host: {
    '[placeholder]': 'placeholder()',
    '[tabindex]': '0',
  },
})
export class MeeSelectInput<T> {
  // Dependencies
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly select = inject<MeeSelect<T>>(MeeSelect, { optional: true });
  readonly inputBase = inject(InputBase);

  // Inputs
  readonly placeholder = input('Search here');
  readonly options = input<T[]>([]);
  readonly filterFn = input<(query: string, value: T, values: T[]) => boolean>();

  // State
  readonly filteredOptions = computed(() => {
    const fn = this.filterFn();
    const options = this.options();
    const search = this.inputBase.value();
    const values = search ? options.filter(v => fn!(search, v, options)) : options;
    console.log(values);
    return values;
  });

  constructor() {
    this.select?.events.subscribe(event => {
      if (event === 'open') {
        this.inputBase.value.set('');
        this.el.nativeElement.focus();
      }
    });
  }

  updateSearch(value: string) {
    this.inputBase.value.set(value);
  }
}

@Directive({
  selector: '[meeSelectTrigger]',
})
export class MeeSelectTrigger {}
