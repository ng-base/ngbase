import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListStyle } from './list.directive';

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
    role: 'list'
  },
  hostDirectives: [ListStyle]
})
export class List {}
