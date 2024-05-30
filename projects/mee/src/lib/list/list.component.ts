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
    class:
      'flex items-center w-full rounded-md p-h text-left hover:bg-lighter outline-0',
  },
})
export class List {}
