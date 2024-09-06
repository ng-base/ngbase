import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { HoverCard } from '@meeui/hover-card';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/dialog';
import { DocCode } from './code.component';
import { Avatar } from '@meeui/avatar';

@Component({
  standalone: true,
  selector: 'app-hover-card',
  imports: [Heading, Button, DialogClose, HoverCard, DocCode, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="hoverCardPage">Hover Card</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <button [meeHoverCard]="myTemplate" meeButton variant="ghost" class="underline">
        Hover over to show hover card
      </button>

      <ng-template #myTemplate>
        <div class="w-96 p-4">
          <div class="flex flex-col gap-b2">
            <mee-avatar
              src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
              alt="Radix UI"
              class="w-b12"
            />
            <div class="flex flex-col gap-b4">
              <div>
                <div class="Text font-bold">Radix</div>
                <div class="text-muted">&#64;radix_ui</div>
              </div>
              <div class="Text">
                Components, icons, colors, and templates for building high-quality, accessible UI.
                Free and open-source.
              </div>
              <div class="flex gap-b4">
                <div class="flex gap-b">
                  <div class="Text font-bold">0</div>
                  <div class="text-muted">Following</div>
                </div>
                <div class="flex gap-b">
                  <div class="Text font-bold">2,900</div>
                  <div class="text-muted">Followers</div>
                </div>
              </div>
            </div>
          </div>
          <!-- <button meeButton meeDialogClose>Close</button> -->
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
