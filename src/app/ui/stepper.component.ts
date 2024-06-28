import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Step, Stepper } from '@meeui/stepper';
import { Button } from '@meeui/button';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Stepper, Step, Button, RangePipe, Heading],
  template: `
    <h4 meeHeader class="mb-5">Stepper</h4>

    <button meeButton (click)="toggleDirection()" class="small mb-5">Toggle Direction</button>
    <mee-stepper #myStepper [activeIndex]="1" [direction]="direction()">
      @for (item of 3 | range; track item) {
        <mee-step title="Step 1">
          <p>Step {{ item }}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro tempore nesciunt
            corrupti, sequi dolore voluptates. Odio molestiae, doloribus laborum neque dignissimos
            nemo omnis dolores, voluptatibus quis ab quisquam, quasi suscipit corporis possimus
            unde! Rem animi, velit, qui quod, natus doloribus ad dolore aperiam ratione explicabo
            suscipit nulla neque perferendis! Dolore.
          </p>
        </mee-step>
      }
    </mee-stepper>
    <button
      meeButton
      variant="outline"
      class="small"
      (click)="myStepper.previous()"
      [disabled]="myStepper.first()"
    >
      Previous
    </button>
    <button meeButton variant="outline" class="small" (click)="myStepper.next()">
      @if (myStepper.completed()) {
        Reset
      } @else if (myStepper.last()) {
        Completed
      } @else {
        Next
      }
    </button>
  `,
})
export class StepperComponent {
  direction = signal<'horizontal' | 'vertical'>('horizontal');

  toggleDirection() {
    this.direction.update(direction => (direction === 'horizontal' ? 'vertical' : 'horizontal'));
  }
}
