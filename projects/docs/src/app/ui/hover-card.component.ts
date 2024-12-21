import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from '@meeui/ui/avatar';
import { Button } from '@meeui/ui/button';
import { HoverCard } from '@meeui/ui/hover-card';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-hover-card',
  imports: [Heading, Button, HoverCard, DocCode, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="hoverCardPage">Hover Card</h4>
    <app-doc-code [tsCode]="tsCode">
      <button [meeHoverCard]="myTemplate" meeButton variant="ghost" class="underline">
        Hover over to show hover card
      </button>

      <ng-template #myTemplate>
        <div class="w-96 p-4">
          <div class="flex flex-col gap-b2">
            <mee-avatar
              src="https://pbs.twimg.com/profile_images/1238875353457635328/VKdeKwcq_200x200.jpg"
              alt="Radix UI"
              class="w-b12"
            />
            <div class="flex flex-col gap-b4">
              <div>
                <div class="Text font-bold">Mee</div>
                <div class="text-muted">&#64;mee_ui</div>
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
export default class HoverCardComponent {
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
  import { Button } from '@meeui/ui/button';
  import { DialogClose } from '@meeui/ui/dialog';
  import { HoverCard } from '@meeui/ui/hover-card';

  @Component({
    selector: 'app-root',
    imports: [Button, DialogClose, HoverCard],
    template: \`
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
    \`,
  })
  export class AppComponent { }
  `;
}
