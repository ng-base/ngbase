import { Directive, inject } from '@angular/core';
import { NgbFormField } from './form-field';

@Directive({
  selector: '[ngbLabel]',
  host: {
    '[attr.for]': 'id',
  },
})
export class NgbLabel {
  private readonly formField = inject(NgbFormField);
  readonly id = this.formField._id;
}
