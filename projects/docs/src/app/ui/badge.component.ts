import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/ui/badge';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Heading, Badge, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Badge</h4>
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <button meeBadge>Badge</button>
    </app-doc-code>
  `,
})
export default class BadgeComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Badge } from '@meeui/ui/badge';

  @Component({
    selector: 'app-root',
    imports: [Badge],
    template: \`
      <button meeBadge>Badge</button>
      <mee-badge>Badge</mee-badge>
    \`,
  })
  export class AppComponent { }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component } from '@angular/core';

  @Component({
    selector: 'mee-badge, [meeBadge]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template:\`<ng-content />\`,
    host: {
      class: 'inline-block bg-muted-background rounded-full px-b2 py-b text-xs font-semibold',
    },
  })
  export class Badge {}
  `;
}
