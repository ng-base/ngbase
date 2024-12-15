import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MeeStepper } from './stepper';

@Component({
  selector: '[meeStep]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `@if (horizontalTemplate(); as template) {
      <ng-container *ngTemplateOutlet="template" />
    }
    <ng-template #stepContainer>
      <div class="py-b4">
        <ng-content />
      </div>
    </ng-template> `,
})
export class MeeStep {
  readonly stepper = inject(MeeStepper);
  readonly header = contentChild(MeeStepHeader, { read: TemplateRef });
  readonly stepContainer = viewChild.required('stepContainer', { read: TemplateRef });

  readonly title = input<any>('Tab');

  readonly index = computed(() => this.stepper.steps().indexOf(this));
  readonly active = computed(() => this.stepper.activeIndex() === this.index());
  private readonly template = computed(() => (this.active() ? this.stepContainer() : null));
  readonly horizontalTemplate = computed(
    () => this.stepper.direction() === 'horizontal' && this.template(),
  );
  readonly verticalTemplate = computed(
    () => this.stepper.direction() === 'vertical' && this.template(),
  );
}

@Directive({
  selector: '[meeStepHeader]',
})
export class MeeStepHeader {}

export const provideStep = (step: typeof MeeStep) => ({
  provide: MeeStep,
  useExisting: step,
});
