import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectBase } from './select-base';
import { provideValueAccessor } from '@meeui/utils';

@Component({
  standalone: true,
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
