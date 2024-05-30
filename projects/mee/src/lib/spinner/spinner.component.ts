import { Component, input } from '@angular/core';

@Component({
  selector: 'mee-spinner',
  standalone: true,
  template: `
    <div
      class="aspect-square w-full animate-spin rounded-full border-2 border-transparent"
      [class]="
        mode() === 'dark' ? 'border-x-white border-t-white' : 'border-l-primary'
      "
    ></div>
  `,
  styles: [],
  host: {
    class: 'inline-block aspect-square w-10',
  },
})
export class Spinner {
  mode = input<'light' | 'dark' | ''>('light');
}
