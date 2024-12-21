import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@meeui/ui/chip';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-chip',
  imports: [Heading, Chip, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5">Chip</h4>
    <app-doc-code [tsCode]="tsCode">
      <div meeChip>Chip</div>
    </app-doc-code>
  `,
})
export default class ChipComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Chip } from '@meeui/ui/chip';

  @Component({
    selector: 'app-root',
    imports: [Chip],
    template: \`<button meeChip>Chip</button>\`,
  })
  export class AppComponent { }
  `;
}
