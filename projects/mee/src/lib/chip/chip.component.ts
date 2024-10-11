import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Button } from '../button';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Directionality } from '../utils/direction.service';
import { Icon } from '../icon';

@Component({
  standalone: true,
  selector: 'mee-chip, [meeChip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content></ng-content>
    @if (removable()) {
      <button
        meeButton
        type="button"
        variant="ghost"
        class="small -my-b2"
        [class]="dir.isRtl() ? '-ml-b4' : '-mr-b4'"
        (click)="close.emit()"
      >
        <mee-icon name="lucideX"></mee-icon>
      </button>
    }`,
  host: {
    class:
      'inline-flex items-center bg-muted-background rounded-base px-b2 py-1 text-xs font-medium',
  },
})
export class Chip<T = any> {
  readonly dir = inject(Directionality);

  readonly removable = input(true, { transform: booleanAttribute });
  readonly value = input<T>();
  readonly close = output();
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
