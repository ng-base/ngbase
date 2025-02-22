import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/ui/badge';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Heading, Badge, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Badge</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <button meeBadge>Badge</button>
    </app-doc-code>
  `,
})
export default class BadgeComponent {
  tsCode = getCode('/badge/badge-usage.ts');

  adkCode = getCode('/badge/badge-adk.ts');
}
