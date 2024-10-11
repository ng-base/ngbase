import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeFocusStyle]',
  host: {
    class:
      'focus-visible:ring-2 ring-primary focus-visible:ring-offset-2 outline-none ring-offset-background',
  },
})
export class FocusStyle {}
