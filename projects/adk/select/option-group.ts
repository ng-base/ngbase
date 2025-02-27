import { Directive, input } from '@angular/core';

@Directive({
  selector: '[ngbOptionGroup]',
})
export class NgbOptionGroup {
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);
}
