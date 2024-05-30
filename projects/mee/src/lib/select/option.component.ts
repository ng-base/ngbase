import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '../checkbox';

@Component({
  standalone: true,
  selector: 'mee-option, [meeOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, FormsModule],
  template: ` @if (multiple()) {
      <mee-checkbox [ngModel]="checked"></mee-checkbox>
    }
    <ng-content></ng-content>`,
  host: {
    class:
      'flex items-center w-full py-b/3 px-b/2 hover:bg-lighter cursor-pointer rounded-md focus:bg-lighter outline-none text-sm',
    role: 'option',
    '(click)': 'selectOption()',
    '[class.bg-lighter]': 'active()',
    tabindex: '-1',
  },
})
export class Option {
  value = input<any>();
  readonly multiple = signal(false);
  checked = false;
  active = signal(false);
  el = inject(ElementRef);

  selectOption() {}

  label() {
    return this.el.nativeElement.textContent;
  }
}
