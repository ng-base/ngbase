import { Directive, ElementRef, inject } from '@angular/core';
import { Select } from './select.component';
import { InputStyle } from '../input/input-style.directive';

@Directive({
  standalone: true,
  selector: '[meeSelectInput]',
  hostDirectives: [InputStyle],
  host: {
    class: 'w-full mb-b !ring-0 border-b rounded-none px-b2',
  },
})
export class SelectInput {
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  select = inject(Select, { optional: true });

  constructor() {
    this.select?.events.subscribe((event) => {
      if (event === 'open') {
        this.el.nativeElement.focus();
      }
    });
  }
}

@Directive({
  standalone: true,
  selector: '[meeSelectTrigger]',
})
export class SelectTrigger {}
