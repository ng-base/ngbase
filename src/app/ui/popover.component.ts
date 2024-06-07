import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { PopoverTrigger, popoverPortal } from '@meeui/popover';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/dialog';

@Component({
  standalone: true,
  selector: 'app-popover',
  imports: [Heading, PopoverTrigger, Button, DialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="popoverPage">Popover</h4>
    <button meeButton (click)="openPopover($event)" class="mr-4">
      Open popover
    </button>
    <button meeButton [meePopoverTrigger]="myTemplate">
      Open popover with template
    </button>

    <ng-template #myTemplate>
      <div class="w-56 p-b2">
        <h4 meeHeader class="">Popover</h4>
        <p class="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita
          sit facere minus minima quis, accusamus vero voluptatem cumque.
          Impedit!
        </p>
        <button meeButton meeDialogClose class="mt-b2">Close</button>
      </div>
    </ng-template>
  `,
})
export class PopoverComponent {
  popoverPortal = popoverPortal();

  openPopover(event: MouseEvent) {
    this.popoverPortal.open(
      AddComponent,
      { target: event.target as HTMLElement },
      { width: '25rem', maxHeight: '30vh', title: 'Add', backdrop: false },
    );
  }
}
