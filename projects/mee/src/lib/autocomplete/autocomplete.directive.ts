import {
  Directive,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { Autocomplete } from './autocomplete.component';

@Directive({
  standalone: true,
  selector: '[meeAutocompleteInput]',
  host: {
    class: 'w-full bg-transparent shadow-none outline-none',
    '(focus)': 'onFocus()',
    '(blur)': 'close()',
    '(input)': 'meeAutocompleteInput.emit($event.target.value)',
    autocomplete: 'off',
  },
})
export class AutocompleteInput {
  autoComplete = inject(Autocomplete);
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  focus = signal(false);
  blur = signal(false);
  meeAutocompleteInput = output<string>();
  search = signal('');

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
}
