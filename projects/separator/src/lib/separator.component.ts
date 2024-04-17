import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  styles: `
    :host {
      @apply my-3 block h-[.01rem] w-full bg-gray-300;
    }
  `,
})
export class Separator {}
