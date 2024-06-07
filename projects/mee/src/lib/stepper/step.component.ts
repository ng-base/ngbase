import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Stepper } from './stepper.component';

@Component({
  standalone: true,
  selector: 'mee-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `@if (active() && stepper.direction() === 'horizontal') {
      <ng-container *ngTemplateOutlet="stepContainer"></ng-container>
    }
    <ng-template #stepContainer>
      <div class="py-b4">
        <ng-content></ng-content>
      </div>
    </ng-template> `,
})
export class Step {
  stepper = inject(Stepper);
  header = contentChild(StepHeader, { read: TemplateRef });
  stepContainer = viewChild('stepContainer', { read: TemplateRef });
  active = signal(false);
  title = input<any>('Tab');
}

@Directive({
  standalone: true,
  selector: '[meeStepHeader]',
})
export class StepHeader {}
