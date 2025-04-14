import {
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { InputBase } from '@ngbase/adk/form-field';
import { NgbAutocomplete } from './autocomplete';

@Directive({
  selector: '[ngbAutocompleteInput]',
  exportAs: 'ngbAutocompleteInput',
  hostDirectives: [{ directive: InputBase, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'close()',
    '(input)': 'updateSearch($event.target.value)',
    autocomplete: 'off',
  },
})
export class NgbAutocompleteInput<T> {
  // Dependencies
  readonly autoComplete = inject(NgbAutocomplete);
  readonly input = inject(InputBase);
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  // Inputs
  readonly ngbAutocompleteInput = output<string>();

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.addEventListener('keydown', event => {
        const value = (event.target as any).value;
        if (event.key === 'Backspace' && value === '') {
          this.autoComplete.popValue();
        }
      });
      // if (this.autoComplete.multiple()) return;
      // this.autoComplete.events.subscribe(event => {
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
    this.ngbAutocompleteInput.emit(value);
  }
}
