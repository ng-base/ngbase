import { Directive, inject } from '@angular/core';
import { MeeFormField } from './form-field';

@Directive({
  selector: '[meeLabel]',
  host: {
    '[attr.for]': 'id',
  },
})
export class MeeLabel {
  private readonly formField = inject(MeeFormField);
  readonly id = this.formField._id;
}
