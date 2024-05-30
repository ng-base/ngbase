import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from '../button';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';

@Component({
  standalone: true,
  selector: 'mee-chip, [meeChip]',
  imports: [Button, Icons],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content></ng-content>
    <button
      meeButton
      class="small -my-2 -mr-b"
      variant="ghost"
      (click)="close.emit()"
    >
      <mee-icon name="lucideX"></mee-icon>
    </button> `,
  host: {
    class:
      'inline-flex items-center bg-background rounded-base px-h py-1 text-xs',
  },
})
export class Chip {
  close = output();
}

// @Component({
//   standalone: true,
//   selector: 'mee-badge, [meeBadge]',
//   template: `<ng-content></ng-content>`,
//   host: {
//     class: 'inline-block bg-background rounded-base px-2 py-1 text-xs',
//   },
// })
// export class Badge {}
