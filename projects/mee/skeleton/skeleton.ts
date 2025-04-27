import { Component, input } from '@angular/core';

@Component({
  selector: 'mee-skeleton',
  template: ``,
  host: {
    class: 'block animate-pulse bg-muted',
    '[class]': `shape() === 'circle' ? 'rounded-full' : 'rounded-md'`,
  },
})
export class Skeleton {
  readonly shape = input<'circle' | 'rectangle'>('rectangle');
  readonly width = input<string>('100%');
  readonly height = input<string>('20px');
}
