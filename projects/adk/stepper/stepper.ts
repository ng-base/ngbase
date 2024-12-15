import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  inject,
  input,
  model,
} from '@angular/core';
import { slideAnimation } from './animation';
import { MeeStep } from './step';

@Directive({
  selector: '[meeStepperStep]',
  host: {
    '[attr.data-status]': 'status()',
    '[attr.aria-current]': 'status() === "active" ? true : undefined',
    '[attr.data-orientation]': 'stepper.direction()',
    '[attr.data-index]': '!last() ? true : undefined',
  },
})
export class MeeStepperStep {
  readonly stepper = inject(MeeStepper);
  readonly meeStepperStep = input(0);
  readonly last = computed(() => this.meeStepperStep() === this.stepper.steps().length - 1);
  readonly status = computed(() => {
    const index = this.meeStepperStep();
    const activeIndex = this.stepper.activeIndex();

    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'active';
    return 'inactive';
  });
}

@Component({
  selector: '[meeStepper]',
  exportAs: 'meeStepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgClass, MeeStepperStep],
  template: `
    <div class="flex justify-between" [class.flex-col]="direction() === 'vertical'">
      @for (step of steps(); track step) {
        <div
          [meeStepperStep]="$index"
          class="relative flex [&:not(:last-child)]:flex-1 [&:not(:last-child)]:after:mx-2 [&:not(:last-child)]:after:block [&:not(:last-child)]:after:flex-1 [&:not(:last-child)]:after:bg-background [&:not(:last-child)]:after:transition-colors"
          [ngClass]="[
            activeIndex() > $index ? '[&:not(:last-child)]:after:bg-primary' : '',
            direction() === 'vertical'
              ? 'flex-col [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:bottom-0 [&:not(:last-child)]:after:left-3 [&:not(:last-child)]:after:top-10 [&:not(:last-child)]:after:w-0.5'
              : 'items-center [&:not(:last-child)]:after:h-0.5',
          ]"
        >
          <div class="flex items-center">
            <div
              class="mr-2 grid aspect-square w-10 place-content-center rounded-full border-2 transition-colors"
              [class.bg-primary]="activeIndex() > $index"
              [class.border-primary]="activeIndex() >= $index"
            >
              {{ $index + 1 }}
            </div>
            @if (step.header(); as header) {
              <ng-container *ngTemplateOutlet="header" />
            } @else {
              {{ step.title() }}
            }
          </div>
          @if (step.verticalTemplate(); as template) {
            <div class="ml-12 min-h-4">
              <div [@slide]>
                <ng-container *ngTemplateOutlet="template" />
              </div>
            </div>
          }
        </div>
      }
    </div>
    <ng-content />
  `,
  animations: [slideAnimation],
})
export class MeeStepper {
  readonly steps = contentChildren(MeeStep);
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

export const provideStepper = (stepper: typeof MeeStepper) => ({
  provide: MeeStepper,
  useExisting: stepper,
});
