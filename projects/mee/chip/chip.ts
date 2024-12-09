import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeChip, MeeChipRemove, provideChip } from '@meeui/adk/chip';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'mee-chip, [meeChip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, MeeChipRemove],
  providers: [provideChip(Chip)],
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content />
    @if (removable()) {
      <button
        meeButton
        meeChipRemove
        variant="ghost"
        class="small -my-b2 data-[dir=ltr]:-mr-b4 data-[dir=rtl]:-ml-b4"
      >
        <mee-icon name="lucideX" />
      </button>
    }`,
  host: {
    class:
      'inline-flex items-center bg-muted-background rounded-base px-b2 py-1 text-xs font-medium',
  },
})
export class Chip<T = any> extends MeeChip<T> {}
