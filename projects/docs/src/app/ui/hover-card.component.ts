import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { HoverCard } from '@meeui/hover-card';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/dialog';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-hover-card',
  imports: [Heading, Button, DialogClose, HoverCard, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="hoverCardPage">Hover Card</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <button [meeHoverCard]="myTemplate" meeButton variant="ghost" class="underline">
        Hover over to show hover card
      </button>

      <ng-template #myTemplate>
        <div class="w-96 p-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
          <button meeButton meeDialogClose>Close</button>
        </div>
      </ng-template>
    </app-doc-code>
  `,
})
export class HoverCardComponent {
  htmlCode = `
      <button [meeHoverCard]="myTemplate" meeButton variant="ghost" class="underline">
        Hover over to show hover card
      </button>

      <ng-template #myTemplate>
        <div class="w-96 p-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
          <button meeButton meeDialogClose>Close</button>
        </div>
      </ng-template>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { Button } from '@meeui/button';
  import { DialogClose } from '@meeui/dialog';
  import { HoverCard } from '@meeui/hover-card';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Button, DialogClose, HoverCard],
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent { }
  `;
}
