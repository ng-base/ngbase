import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[meeList]',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host[disabled] {
      @apply cursor-not-allowed text-gray-400;
    }
  `,
  host: {
    class: 'block w-full rounded-md p-2 text-left hover:bg-lighter',
  },
})
export class List {}
