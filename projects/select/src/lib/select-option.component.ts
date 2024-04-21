import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-select-option',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'block w-full px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md',
    role: 'option',
    '(click)': 'selectOption()',
  },
})
export class SelectOption {
  value = input.required<any>();

  selectOption() {}
}
