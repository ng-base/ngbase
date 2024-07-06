import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectBase } from '../select/select-base.component';

@Component({
  standalone: true,
  selector: 'mee-list-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListSelection),
      multi: true,
    },
  ],
})
export class ListSelection<T> extends SelectBase<T> {
  // readonly selectOptions = contentChildren(Option, { descendants: true });

  constructor() {
    super(true);
    // effect(() => this.options.set(this.selectOptions()), { allowSignalWrites: true });
  }
}
