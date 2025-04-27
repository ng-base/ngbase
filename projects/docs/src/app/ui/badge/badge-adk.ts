import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-badge, [meeBadge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-block bg-muted rounded-full px-2 py-1 text-xs font-semibold',
  },
})
export class Badge {}
