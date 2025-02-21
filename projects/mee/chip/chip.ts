import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbChip, NgbChipGroup, NgbChipRemove, provideChip } from '@ngbase/adk/chip';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'mee-chip-group',
  hostDirectives: [NgbChipGroup],
  template: `<ng-content />`,
})
export class ChipGroup<T> {}

@Component({
  selector: 'mee-chip, [meeChip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, NgbChipRemove],
  providers: [provideChip(Chip)],
  viewProviders: [provideIcons({ lucideX })],
  template: `<ng-content />
    @if (removable()) {
      <button
        meeButton="ghost"
        ngbChipRemove
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
export class Chip<T = any> extends NgbChip<T> {}
