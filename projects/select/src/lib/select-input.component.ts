import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { Select } from './select.component';

@Component({
  standalone: true,
  selector: '[meeSelectInput]',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block w-full rounded bg-gray-100 border px-3 py-1 mb-1 outline-none focus:ring-primary',
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
