import { Directive } from '@angular/core';
import { provideValueAccessor } from '@meeui/adk/utils';
import { SelectBase } from './select-base';

@Directive({
  selector: '[meeListSelection]',
  providers: [provideValueAccessor(ListSelection)],
})
export class ListSelection<T> extends SelectBase<T> {
  constructor() {
    super(true);
  }
}
