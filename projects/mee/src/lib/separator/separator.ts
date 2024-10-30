import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'bg-border block flex-none',
    '[class]': `vertical() ? 'w-[1px]' : 'h-[1px] w-full'`,
    // '[class.my-b]': `menu`,
  },
})
export class Separator {
  vertical = input(false, { transform: booleanAttribute });

  constructor() {
    // console.log('Separator', this.menu);
  }
}
