import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '../checkbox';

@Component({
  standalone: true,
  selector: 'mee-select-option',
  imports: [Checkbox, FormsModule],
  template: ` @if (multiple) {
      <mee-checkbox [ngModel]="checked"></mee-checkbox>
    }
    <ng-content></ng-content>`,
  host: {
    class:
      'flex items-center w-full px-3 py-2 hover:bg-lighter cursor-pointer rounded-md',
    role: 'option',
    '(click)': 'selectOption()',
  },
})
export class SelectOption {
  value = input.required<any>();
  multiple = false;
  checked = false;

  selectOption() {}
}
