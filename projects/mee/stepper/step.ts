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
import { Stepper } from './stepper';

@Component({
  selector: 'mee-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `@if (active() && stepper.direction() === 'horizontal') {
      <ng-container *ngTemplateOutlet="stepContainer" />
    }
    <ng-template #stepContainer>
      <div class="py-b4">
        <ng-content />
      </div>
    </ng-template> `,
})
export class Step {
  readonly stepper = inject(Stepper);
  readonly header = contentChild(StepHeader, { read: TemplateRef });
  readonly stepContainer = viewChild.required('stepContainer', { read: TemplateRef });
  readonly active = signal(false);
  readonly title = input<any>('Tab');
}

@Directive({
  selector: '[meeStepHeader]',
})
export class StepHeader {}
