import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-card, [meeCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block rounded-lg border bg-foreground p-4',
  },
})
export class Card {}
