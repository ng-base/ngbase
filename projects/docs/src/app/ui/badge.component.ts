import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/badge';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Heading, Badge, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Badge</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeBadge>Badge</button>
    </app-doc-code>
  `,
})
export class BadgeComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Badge } from '@meeui/badge';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`<button meeBadge>Badge</button>\`,
    imports: [Badge],
  })
  export class AppComponent { }
  `;
}
