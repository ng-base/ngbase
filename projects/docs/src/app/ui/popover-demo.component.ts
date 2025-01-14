import { Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { PopoverTrigger, PopoverClose } from '@meeui/ui/popover';

@Component({
  selector: 'app-popover-demo',
  imports: [Button, PopoverClose, PopoverTrigger],
  template: `
    <div
      class="absolute left-0 top-0 aspect-square w-40 border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>
    <div
      class="absolute right-0 top-0 aspect-square w-40 border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>
    <!-- <div
      class="absolute bottom-0 top-10 aspect-square w-40 border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div> -->
    <div
      class="absolute bottom-0 right-0 aspect-square w-40 border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>

    <ng-template #myTemplate>
      <div class="w-56">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
        <button meeButton meePopoverClose>Close</button>
      </div>
    </ng-template>
  `,
  host: {
    class: 'block w-full h-[200vh]',
  },
})
export class PopoverDemoComponent {}
