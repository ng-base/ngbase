import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormField } from './form-field';

@Component({
  selector: '[meeLabel]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block font-medium text-left mx-b0.5',
    '[attr.for]': 'id',
  },
})
export class Label {
  private readonly formField = inject(FormField);
  readonly id = this.formField.id;
}
