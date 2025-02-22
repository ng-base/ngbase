import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { PopoverTrigger, popoverPortal, PopoverClose } from '@meeui/ui/popover';
import { Heading } from '@meeui/ui/typography';
import { AddComponent } from '../add.component';
import { DocCode } from './code.component';

@Component({
  selector: 'app-popover',
  imports: [Heading, PopoverTrigger, Button, PopoverClose, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="popoverPage">Popover</h4>

    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="openPopover($event)" class="mr-4">Open popover</button>
      <button meeButton [meePopoverTrigger]="myTemplate">Open popover with template</button>
    </app-doc-code>

    <ng-template #myTemplate>
      <div class="w-56 p-2">
        <h4 meeHeader class="">Popover</h4>
        <p class="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
          minima quis, accusamus vero voluptatem cumque. Impedit!
        </p>
        <button meeButton meePopoverClose class="mt-2">Close</button>
      </div>
    </ng-template>
  `,
})
export default class PopoverComponent {
  popoverPortal = popoverPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { popoverPortal, PopoverTrigger, PopoverClose } from '@ngbase/adk/popover';
  import { AddComponent } from '../add.component';

  @Component({
    selector: 'app-root',
    imports: [PopoverTrigger, PopoverClose],
    template: \`
      <button (click)="openPopover($event)">Open popover</button>
      <button [meePopoverTrigger]="myTemplate">Open popover with template</button>

      <ng-template #myTemplate>
        <div class="w-56 p-2">
          <h4 meeHeader class="">Popover</h4>
          <p class="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita sit facere minus
            minima quis, accusamus vero voluptatem cumque. Impedit!
          </p>
          <button meeButton meePopoverClose class="mt-2">Close</button>
        </div>
      </ng-template>
    \`
  })
  export class AppComponent {
    popoverPortal = popoverPortal();

    openPopover(event: MouseEvent) {
      this.popoverPortal.open(
        AddComponent,
        { target: event.target as HTMLElement },
        { width: '25rem', maxHeight: '30vh', title: 'Add', backdrop: false },
      );
    }
  }
  `;

  openPopover(event: MouseEvent) {
    this.popoverPortal.open(AddComponent, {
      target: event.target as HTMLElement,
      width: '25rem',
      maxHeight: '30vh',
      title: 'Add',
      backdrop: false,
    });
  }
}
