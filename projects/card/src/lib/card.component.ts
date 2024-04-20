import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block rounded-md border bg-fg p-4',
  },
})
export class Card {}
