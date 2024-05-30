import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-card, [meeCard]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block rounded-base border border-border bg-foreground p-b text-left',
  },
})
export class Card {}
