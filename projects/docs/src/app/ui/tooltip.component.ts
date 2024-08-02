import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Tooltip } from '@meeui/tooltip';
import { Button } from '@meeui/button';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-tooltip',
  imports: [Heading, Tooltip, Button, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="tooltipPage">Tooltip</h4>

    <app-doc-code [tsCode]="tsCode">
      <div class="flex justify-between gap-b4">
        <button meeTooltip="Tooltip" meeButton>Hover over to show tooltip</button>
        <button meeTooltip="Tooltip with longer content" meeButton>show</button>
      </div>
    </app-doc-code>
  `,
})
export class TooltipComponent {
  slider = 50;

  tsCode = `
  import { Component } from '@angular/core';
  import { Tooltip } from '@meeui/tooltip';
  import { Button } from '@meeui/button';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Tooltip, Button],
    template: \`
      <button meeTooltip="Tooltip" meeButton>Hover over to show tooltip</button>
      <button meeTooltip="Tooltip with longer content" meeButton>show</button>
    \`
  })
  export class AppComponent { }
  `;
}
