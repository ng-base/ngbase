import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@meeui/ui/chip';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-chip',
  imports: [Heading, Chip, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5">Chip</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <div meeChip>Chip</div>
    </app-doc-code>
  `,
})
export default class ChipComponent {
  tsCode = getCode('/chip/chip-usage.ts');

  adkCode = getCode('/chip/chip-adk.ts');
}
