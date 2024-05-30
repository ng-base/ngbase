import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeInputStyle]',
  host: {
    class:
      'inline-block text-left rounded-base bg-foreground px-3 py-h outline-none ring-1 ring-border focus:ring-2 focus:ring-primary',
  },
})
export class InputStyle {}
