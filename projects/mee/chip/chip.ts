import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Button } from '@meeui/ui/button';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Directionality } from '@meeui/ui/adk';
import { Icon } from '@meeui/ui/icon';

@Component({
  selector: 'mee-chip, [meeChip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content />
    @if (removable()) {
      <button
        meeButton
        type="button"
        variant="ghost"
        class="small -my-b2"
        [class]="dir.isRtl() ? '-ml-b4' : '-mr-b4'"
        (click)="close.emit()"
      >
        <mee-icon name="lucideX" />
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
