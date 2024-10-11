import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@meeui/chip';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-chip',
  imports: [Heading, Chip, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5">Chip</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <div meeChip>Chip</div>
    </app-doc-code>
  `,
})
export class ChipComponent {
  htmlCode = `
      <button meeChip>Chip</button>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { Chip } from '@meeui/chip';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Chip],
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent { }
  `;
}
