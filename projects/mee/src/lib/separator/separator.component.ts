import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Menu } from '../menu';

@Component({
  selector: 'mee-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    class: 'bg-border block flex-none',
    '[class]': `orientation() === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px]'`,
    // '[class.my-b]': `menu`,
  },
})
export class Separator {
  // menu = inject(Menu, { optional: true });
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  constructor() {
    // console.log('Separator', this.menu);
  }
}
