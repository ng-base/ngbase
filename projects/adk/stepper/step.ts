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
import { NgbStepper } from './stepper';

@Component({
  selector: '[ngbStep]',
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
export class NgbStep {
  readonly stepper = inject(NgbStepper);
  readonly header = contentChild(NgbStepHeader, { read: TemplateRef });
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
  selector: '[ngbStepHeader]',
})
export class NgbStepHeader {}

export const provideStep = (step: typeof NgbStep) => ({
  provide: NgbStep,
  useExisting: step,
});
