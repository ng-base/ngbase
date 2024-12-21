import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Tooltip } from '@meeui/ui/tooltip';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
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
export default class TooltipComponent {
  slider = 50;

  tsCode = `
  import { Component } from '@angular/core';
  import { Tooltip } from '@meeui/ui/tooltip';
  import { Button } from '@meeui/ui/button';

  @Component({
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
