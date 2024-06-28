import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Checkbox } from '../checkbox';
import { ListStyle } from '../list';

@Component({
  standalone: true,
  selector: 'mee-option, [meeOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox],
  template: ` @if (multiple()) {
      <mee-checkbox [checked]="checked()" class="mr-b2 !py-0" />
    }
    <ng-content />`,
  host: {
    role: 'option',
    '(click)': 'selectOption()',
    '[class.bg-muted-background]': 'active()',
    tabindex: '-1',
  },
  hostDirectives: [ListStyle],
})
export class Option<T> {
  value = input<T>();
  readonly multiple = signal(false);
  checked = signal(false);
  active = signal(false);
  disabled = input(false);
  el = inject(ElementRef);

  selectOption() {}

  label() {
    return this.el.nativeElement.textContent;
  }
}
