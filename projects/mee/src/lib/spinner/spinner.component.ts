import { Component, input } from '@angular/core';

@Component({
  selector: 'mee-spinner',
  standalone: true,
  template: `
    <div
      class="aspect-square w-full animate-spin rounded-full border-primary border-l-transparent"
      [class]="mode()"
      [style.border-width.px]="strokeWidth()"
    ></div>
  `,
  styles: [],
  host: {
    class: 'inline-block aspect-square',
    '[style.width.px]': 'diameter()',
  },
})
export class Spinner {
  mode = input<'light' | 'dark' | ''>('light');

  diameter = input<number>(35);

  strokeWidth = input<any>(2);
}
