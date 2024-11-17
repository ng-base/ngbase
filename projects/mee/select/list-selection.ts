import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideValueAccessor } from '@meeui/ui/utils';
import { SelectBase } from './select-base';

@Component({
  selector: 'mee-list-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  providers: [provideValueAccessor(ListSelection)],
})
export class ListSelection<T> extends SelectBase<T> {
  constructor() {
    super(true);
  }
}
