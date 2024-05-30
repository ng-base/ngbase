import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mee-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'bg-border block flex-none',
    '[class]': `orientation() === 'horizontal' ? 'h-[.01rem] w-full' : 'w-[.01rem]'`,
  },
})
export class Separator {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
}
