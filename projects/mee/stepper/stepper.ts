import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeStep,
  MeeStepHeader,
  MeeStepper,
  MeeStepperStep,
  provideStep,
  provideStepper,
  slideAnimation,
} from '@meeui/adk/stepper';

@Component({
  selector: 'mee-stepper',
  exportAs: 'meeStepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideStepper(Stepper)],
  imports: [NgTemplateOutlet, NgClass, MeeStepperStep],
  template: `
    <div class="flex justify-between" [class.flex-col]="direction() === 'vertical'">
      @for (step of steps(); track step) {
        <div
          [meeStepperStep]="$index"
          class="relative flex pb-b4 data-[index]:flex-1 data-[index]:after:mx-2 data-[index]:after:block data-[index]:after:flex-1 data-[index]:after:bg-background data-[index]:after:transition-colors"
          [ngClass]="[
            activeIndex() > $index ? 'data-[index]:after:bg-primary' : '',
            direction() === 'vertical'
              ? 'flex-col data-[index]:after:absolute data-[index]:after:bottom-0 data-[index]:after:left-3 data-[index]:after:top-10 data-[index]:after:w-0.5'
              : 'items-center data-[index]:after:h-0.5',
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
            <div class="ml-12" [@slide]>
              <div class="pt-b4">
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
export class Stepper extends MeeStepper {}

@Component({
  selector: 'mee-step',
  exportAs: 'meeStep',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideStep(Step)],
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #stepContainer>
      <ng-content />
    </ng-template>

    @if (horizontalTemplate(); as template) {
      <div class="pb-b4">
        <ng-container *ngTemplateOutlet="template" />
      </div>
    }
  `,
})
export class Step extends MeeStep {}

@Directive({
  selector: '[meeStepHeader]',
  hostDirectives: [MeeStepHeader],
})
export class StepHeader {}
