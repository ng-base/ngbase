import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideValueAccessor } from '@ngbase/adk/utils';
import { SelectBase } from '@ngbase/adk/select';

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
