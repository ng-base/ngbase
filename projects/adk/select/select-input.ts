import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { Autofocus } from '@ngbase/adk/a11y';
import { InputBase } from '@ngbase/adk/form-field';
import { NgbSelect } from './select';

@Directive({
  selector: '[ngbSelectInput]',
  exportAs: 'ngbSelectInput',
  hostDirectives: [
    Autofocus,
    { directive: InputBase, inputs: ['value'], outputs: ['valueChange'] },
  ],
  host: {
    '[placeholder]': 'placeholder()',
    '[tabindex]': '0',
  },
})
export class NgbSelectInput<T> {
  // Dependencies
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly select = inject<NgbSelect<T>>(NgbSelect, { optional: true });
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
  selector: '[ngbSelectTrigger]',
})
export class NgbSelectTrigger {}
