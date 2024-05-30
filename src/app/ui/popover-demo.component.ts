import { Component } from '@angular/core';
import { Drag, DragMove } from '@meeui/drag';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/portal';
import { PopoverTrigger } from '@meeui/popover';

@Component({
  standalone: true,
  selector: 'app-popover-demo',
  imports: [Drag, DragMove, Button, DialogClose, PopoverTrigger],
  template: `
    <div
      class="absolute left-0 top-0 aspect-square w-40 border border-border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>
    <div
      class="absolute right-0 top-0 aspect-square w-40 border border-border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>
    <!-- <div
      class="absolute bottom-0 top-10 aspect-square w-40 border border-border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div> -->
    <div
      class="absolute bottom-0 right-0 aspect-square w-40 border border-border bg-slate-100"
      [meePopoverTrigger]="myTemplate"
      [options]="{ position: 'right', anchor: true }"
    ></div>

    <ng-template #myTemplate>
      <div class="w-56">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita
          sit facere minus minima quis, accusamus vero voluptatem cumque.
          Impedit!
        </p>
        <button meeButton meeDialogClose>Close</button>
      </div>
    </ng-template>
  `,
  host: {
    class: 'block w-full h-[200vh]',
  },
})
export class PopoverDemoComponent {}
