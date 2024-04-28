import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeInputStyle]',
  host: {
    class:
      'block w-full rounded-md bg-background border border-border px-3 py-2 mb-1 outline-none focus:ring-primary',
  },
})
export class InputStyle {
  constructor() {}
}
