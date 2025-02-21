import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Step, Stepper } from '@meeui/ui/stepper';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Stepper, Step, Button, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Stepper</h4>

    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <button meeButton (click)="toggleDirection()" class="small mb-5">Toggle Direction</button>
      <mee-stepper #myStepper [(activeIndex)]="activeIndex" [direction]="direction()">
        @for (item of [1, 2, 3]; track item) {
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
        meeButton="outline"
        class="small"
        (click)="myStepper.prevStep()"
        [disabled]="myStepper.first()"
      >
        Previous
      </button>
      <button meeButton="outline" class="small" (click)="myStepper.nextStep()">
        @if (myStepper.completed()) {
          Reset
        } @else if (myStepper.last()) {
          Completed
        } @else {
          Next
        }
      </button>
    </app-doc-code>
  `,
})
export default class StepperComponent {
  readonly activeIndex = signal(0);
  readonly direction = signal<'horizontal' | 'vertical'>('horizontal');

  readonly tsCode = getCode('stepper/stepper-usage.ts');
  readonly adkCode = getCode('stepper/stepper-adk.ts');

  toggleDirection() {
    this.direction.update(direction => (direction === 'horizontal' ? 'vertical' : 'horizontal'));
  }
}
