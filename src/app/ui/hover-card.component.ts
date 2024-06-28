import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { HoverCard } from '@meeui/hover-card';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/dialog';

@Component({
  standalone: true,
  selector: 'app-hover-card',
  imports: [Heading, Button, DialogClose, HoverCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="hoverCardPage">Hover Card</h4>
    <button [meeHoverCard]="myTemplate" meeButton>Hover over to show hover card</button>

    <ng-template #myTemplate>
      <div class="w-96 p-4">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
        <button meeButton meeDialogClose>Close</button>
      </div>
    </ng-template>
  `,
  host: {},
})
export class HoverCardComponent {}
