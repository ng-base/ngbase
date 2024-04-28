import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { Select } from './select.component';
import { InputStyle } from '../input/input.directive';

@Component({
  standalone: true,
  selector: '[meeSelectInput]',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [InputStyle],
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
