import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeHeader]',
  host: {
    class: 'text-2xl font-bold',
  },
})
export class Heading {}
