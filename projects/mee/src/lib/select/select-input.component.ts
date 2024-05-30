import { Directive, ElementRef, inject } from '@angular/core';
import { Select } from './select.component';
import { InputStyle } from '../input/input-style.directive';

@Directive({
  standalone: true,
  selector: '[meeSelectInput]',
  hostDirectives: [InputStyle],
  host: {
    class: 'w-full mb-h !ring-0 border-b border-border rounded-none px-b/2',
  },
})
export class SelectInput {
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  select = inject(Select);

  constructor() {
    this.select.events.subscribe((event) => {
      if (event === 'open') {
        this.el.nativeElement.focus();
      }
    });
  }
}
