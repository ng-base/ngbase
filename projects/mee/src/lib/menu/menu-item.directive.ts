import { Directive, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeMenuItem]',
})
export class MenuItem {
  active = signal(false);
}
