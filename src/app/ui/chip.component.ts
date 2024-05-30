import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@meeui/chip';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-chip',
  imports: [Heading, Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5">Chip</h4>

    <button meeChip>Chip</button>
  `,
})
export class ChipComponent {}
