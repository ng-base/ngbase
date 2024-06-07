import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-badge, [meeBadge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class:
      'inline-block bg-muted-background rounded-full px-b2 py-b text-xs font-semibold',
  },
})
export class Badge {}
