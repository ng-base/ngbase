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
      'flex items-center w-full rounded-md gap-b2 p-b2 text-left hover:bg-muted-background outline-0',
  },
})
export class List {}
