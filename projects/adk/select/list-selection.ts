import { Directive } from '@angular/core';
import { provideValueAccessor } from '@ngbase/adk/utils';
import { SelectBase } from './select-base';

@Directive({
  selector: '[ngbListSelection]',
  providers: [provideValueAccessor(ListSelection)],
})
export class ListSelection<T> extends SelectBase<T> {
  constructor() {
    super(true);
  }
}
