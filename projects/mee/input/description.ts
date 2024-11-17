import { Directive } from '@angular/core';

@Directive({
  selector: '[meeDescription]',
  host: {
    class: 'text-sm text-muted',
  },
})
export class Description {}
