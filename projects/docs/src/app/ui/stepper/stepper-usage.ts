import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Step, Stepper } from '@meeui/ui/stepper';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Stepper, Step],
  template: `
    <mee-stepper [(activeIndex)]="activeIndex" [direction]="direction()">
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
    <button meeButton (click)="toggleDirection()">Toggle Direction</button>
  `,
})
export class AppComponent {
  readonly activeIndex = signal(1);
  readonly direction = signal<'horizontal' | 'vertical'>('horizontal');

  toggleDirection() {
    this.direction.update(direction => (direction === 'horizontal' ? 'vertical' : 'horizontal'));
  }
}
