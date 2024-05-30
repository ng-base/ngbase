import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Tooltip } from '@meeui/tooltip';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-tooltip',
  imports: [Heading, Tooltip, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="tooltipPage">Tooltip</h4>
    <button meeTooltip="Tooltip" meeButton>Hover over to show tooltip</button>
  `,
})
export class TooltipComponent {
  slider = 50;
}
