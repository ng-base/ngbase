import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'button[meeButton], a[meeButton]',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-block rounded bg-primary px-4 py-1 text-white hover:bg-opacity-80 active:bg-opacity-70',
  },
})
export class Button {
  variant = input<'primary' | 'outline'>('primary');
}
