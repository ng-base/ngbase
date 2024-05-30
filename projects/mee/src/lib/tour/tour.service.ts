import { Injectable, computed, signal } from '@angular/core';
import { TourStep } from './tour-step.directive';
import { DialogInput } from '@meeui/portal';
import { PopoverOpen, popoverPortal } from '../popover';

@Injectable({ providedIn: 'root' })
export class TourService {
  private popover = popoverPortal();
  steps = signal<TourStep[]>([]);
  step = signal(-1);
  private diaRef?: PopoverOpen<any>;
  private id = 0;
  private template!: DialogInput<any>;
  showPrev = computed(() => this.step() > 0);
  showNext = computed(() => this.step() < this.steps().length - 1);
  isLast = computed(() => this.step() === this.steps().length - 1);
  totalSteps = computed(() => this.steps().length);
  scrolled = signal(0);
  private clipPath = computed(() => {
    const step = this.step();
    const _ = this.scrolled();
    const currentStep = this.steps()[step];
    const { width, height, top, left } =
      currentStep.el.nativeElement.getBoundingClientRect();
    return `polygon(
      0 0,
      100% 0,
      100% ${top}px,
      ${left}px ${top}px,
      ${left}px ${top + height}px,
      ${left + width}px ${top + height}px,
      ${left + width}px ${top}px,
      100% ${top}px,
      100% 100%,
      0 100%,
      0 0
    )`;
  });

  constructor() {}

  addStep(step: TourStep) {
    this.steps.update((x) => [...x, step]);
  }

  start<T>(comp: DialogInput<T>) {
    this.template = comp;
    this.step.set(-1);
    this.next();
  }

  prev() {
    const steps = this.steps();
    const prevStep = this.step();
    if (steps.length) {
      const step = (prevStep - 1 + steps.length) % steps.length;
      this.go(step);
    }
  }

  next() {
    const steps = this.steps();
    const prevStep = this.step();
    if (steps.length) {
      const step = (prevStep + 1) % steps.length;
      if (prevStep > step) {
        console.log('next', step);
        this.stop();
        return;
      }
      this.go(step);
    }
  }

  go(step: number) {
    const steps = this.steps();
    if (steps.length) {
      // validate the step number is within the range
      if (step < 0 || step >= steps.length) {
        return;
      }
      this.step.set(step);
      if (this.diaRef) {
        this.diaRef.parent.target.set(steps[step].el.nativeElement);
      } else {
        this.showOverlay(steps[step].el.nativeElement);
      }
    }
  }

  stop() {
    this.hideOverlay();
    clearInterval(this.id);
  }

  private showOverlay(el: HTMLElement) {
    this.diaRef?.diaRef.close();

    this.diaRef = this.popover.open(
      this.template,
      {
        target: el,
        position: 'right',
        className: 'transition-all',
        backdropClassName: 'bg-black/20',
        clipPath: this.clipPath,
        smoothScroll: true,
        anchor: true,
      },
      { backdropColor: true, width: '400px', disableClose: true },
    );
    this.scrolled = this.diaRef.parent.scrolled;
  }

  private hideOverlay() {
    this.diaRef?.diaRef.close();
    this.diaRef = undefined;
  }
}
