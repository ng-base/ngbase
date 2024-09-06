import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Icon } from '../icon';

@Component({
  standalone: true,
  selector: 'mee-chip, [meeChip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content></ng-content>
    @if (removable()) {
      <button meeButton class="small -my-b2 -mr-b4" variant="ghost" (click)="close.emit()">
        <mee-icon name="lucideX"></mee-icon>
      </button>
    }`,
  host: {
    class:
      'inline-flex items-center bg-muted-background rounded-base px-b2 py-1 text-xs font-medium',
  },
})
export class Chip {
  close = output();
  removable = input(true);
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
