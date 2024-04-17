import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[meeList]',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply block w-full rounded-md p-2 text-left hover:bg-gray-100;
    }
  `,
})
export class ListComponent {}
