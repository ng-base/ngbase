import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  styles: `
    :host {
      @apply bg-border my-3 block h-[.01rem] w-full;
    }
  `,
})
export class Separator {}
