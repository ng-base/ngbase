import { Injectable, computed, signal } from '@angular/core';
import { DialogInput } from '@ngbase/adk/portal';
import { PopoverOpen, ngbPopoverPortal } from '@ngbase/adk/popover';
import { NgbTourStep } from './tour-step';

@Injectable({ providedIn: 'root' })
export class NgbTourService {
  private popover = ngbPopoverPortal();
  readonly steps = signal<NgbTourStep[]>([]);
  readonly step = signal(-1);
  private readonly ids = signal<string[]>([]);
  currentStep = computed(() => {
    const id = this.ids()[this.step()];
    const steps = this.steps();
    return steps.find(x => x.ngbTourStep() === id);
  });
  private diaRef?: PopoverOpen<any>;
  private id = 0;
  private template!: DialogInput<any>;
  readonly showPrev = computed(() => this.step() > 0);
  readonly showNext = computed(() => this.step() < this.ids().length - 1);
  readonly isLast = computed(() => this.step() === this.ids().length - 1);
  readonly totalSteps = computed(() => this.ids().length);
  scrolled = signal(0);
  private clipPath = computed(() => {
    const _ = this.scrolled();
    const currentStep = this.currentStep();
    if (!currentStep) {
      return '';
    }
    const { width, height, top, left } = currentStep.el.nativeElement.getBoundingClientRect();
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

  addStep(step: NgbTourStep) {
    this.steps.update(x => [...x, step]);
  }

  start<T>(comp: DialogInput<T>, ids: string[]) {
    this.template = comp;
    this.ids.set(ids);
    this.step.set(-1);
    this.next();
  }

  prev() {
    const steps = this.ids();
    const prevStep = this.step();
    if (steps.length) {
      const step = (prevStep - 1 + steps.length) % steps.length;
      this.go(step);
    }
  }

  next() {
    const steps = this.ids();
    const prevStep = this.step();
    if (steps.length) {
      const step = (prevStep + 1) % steps.length;
      if (prevStep > step) {
        this.stop();
        return;
      }
      this.go(step);
    }
  }

  go(id: number) {
    const steps = this.steps();
    const ids = this.ids();
    if (steps.length) {
      // validate the step number is within the range
      if (id < 0 || id >= ids.length) {
        return;
      }
      this.step.set(id);
      const step = steps.find(x => x.ngbTourStep() === ids[id]);
      if (!step) {
        return;
      }
      if (this.diaRef) {
        this.diaRef.parent.target.set(step.el.nativeElement);
      } else {
        this.showOverlay(step.el.nativeElement);
      }
    }
  }

  stop() {
    this.hideOverlay();
    clearInterval(this.id);
  }

  private showOverlay(el: HTMLElement) {
    this.diaRef?.diaRef.close();

    this.diaRef = this.popover.open(this.template, {
      target: el,
      position: 'right',
      className: 'transition-all',
      backdropClassName: 'bg-black/20',
      clipPath: this.clipPath,
      smoothScroll: true,
      anchor: true,
      backdropColor: true,
      width: '400px',
      disableClose: true,
    });
    this.scrolled = this.diaRef.parent.scrolled;
  }

  private hideOverlay() {
    this.diaRef?.diaRef.close();
    this.diaRef = undefined;
  }
}
