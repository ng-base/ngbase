import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-card, [meeCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'block rounded-base border bg-foreground p-b4 text-left overflow-hidden',
  },
})
export class Card {}
