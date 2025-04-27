import { computed, contentChildren, Directive, inject, input, model } from '@angular/core';
import { NgbStep } from './step';

@Directive({
  selector: '[ngbStepperStep]',
  host: {
    '[attr.data-status]': 'status()',
    '[attr.aria-current]': 'status() === "active" ? true : undefined',
    '[attr.data-orientation]': 'stepper.direction()',
    '[attr.data-index]': '!last() ? true : undefined',
  },
})
export class NgbStepperStep {
  readonly stepper = inject(NgbStepper);
  readonly ngbStepperStep = input(0);
  readonly last = computed(() => this.ngbStepperStep() === this.stepper.steps().length - 1);
  readonly status = computed(() => {
    const index = this.ngbStepperStep();
    const activeIndex = this.stepper.activeIndex();

    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'active';
    return 'inactive';
  });
}

@Directive({
  selector: '[ngbStepper]',
  exportAs: 'ngbStepper',
})
export class NgbStepper {
  readonly steps = contentChildren(NgbStep);

  readonly activeIndex = model(0);
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');

  readonly first = computed(() => this.activeIndex() === 0);
  readonly last = computed(() => this.activeIndex() === this.steps().length - 1);
  readonly completed = computed(() => this.activeIndex() === this.steps().length);

  nextStep() {
    this.activeIndex.update(index => Math.min(index + 1, this.steps().length));
  }

  prevStep() {
    this.activeIndex.update(index => Math.max(index - 1, 0));
  }
}

export const aliasStepper = (stepper: typeof NgbStepper) => ({
  provide: NgbStepper,
  useExisting: stepper,
});
