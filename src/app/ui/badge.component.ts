import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/badge';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Heading, Badge],
  template: `
    <h4 meeHeader class="mb-5">Badge</h4>
    <button meeBadge>Badge</button>
  `,
})
export class BadgeComponent {}
