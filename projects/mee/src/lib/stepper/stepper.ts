import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { Step } from './step';

@Component({
  selector: 'mee-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgClass],
  template: `
    <div class="flex justify-between" [class.flex-col]="direction() === 'vertical'">
      @for (step of steps(); track step) {
        <div
          class="testy relative flex [&:not(:last-child)]:flex-1 [&:not(:last-child)]:after:mx-2 [&:not(:last-child)]:after:block [&:not(:last-child)]:after:flex-1 [&:not(:last-child)]:after:bg-background [&:not(:last-child)]:after:transition-colors"
          [ngClass]="[
            activeIndex() > $index ? '[&:not(:last-child)]:after:bg-primary' : '',
            direction() === 'vertical'
              ? 'flex-col [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:bottom-0 [&:not(:last-child)]:after:left-3 [&:not(:last-child)]:after:top-10 [&:not(:last-child)]:after:w-0.5'
              : 'items-center [&:not(:last-child)]:after:h-0.5',
          ]"
          [attr.data]="!$last"
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
          @if (direction() === 'vertical') {
            <div class="ml-12 min-h-4">
              @if (step.stepContainer() && step.active()) {
                <div [@slide]>
                  <ng-container *ngTemplateOutlet="step.stepContainer()" />
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
    <ng-content />
  `,
  animations: [
    trigger('slide', [
      state('void', style({ height: '0', overflow: 'hidden' })),
      state('*', style({ height: '*' })),
      transition('void => *', animate('200ms ease')),
      transition('* => void', animate('200ms ease')),
    ]),
  ],
})
export class Stepper {
  readonly steps = contentChildren(Step);
  readonly activeIndex = model(0);
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');

  readonly first = computed(() => this.activeIndex() === 0);
  readonly last = computed(() => this.activeIndex() === this.steps().length - 1);
  readonly completed = computed(() => this.activeIndex() === this.steps().length);

  constructor() {
    effect(() => {
      const steps = this.steps();
      const activeIndex = this.activeIndex();

      steps.forEach((step, index) => {
        step.active.set(activeIndex === index);
      });
    });
  }

  next() {
    this.activeIndex.update(index => Math.min(index + 1, this.steps().length));
  }

  previous() {
    this.activeIndex.update(index => Math.max(index - 1, 0));
  }
}
