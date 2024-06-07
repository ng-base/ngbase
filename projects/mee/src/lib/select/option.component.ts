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
      <mee-checkbox [ngModel]="checked" class="mr-b2" />
    }
    <ng-content />`,
  host: {
    class:
      'flex items-center w-full py-b1.5 px-b2 hover:bg-muted-background cursor-pointer rounded-md focus:bg-muted-background outline-none text-sm',
    role: 'option',
    '(click)': 'selectOption()',
    '[class.bg-muted-background]': 'active()',
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
