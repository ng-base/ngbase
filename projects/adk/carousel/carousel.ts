import {
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';
import { Drag } from '@meeui/adk/drag';
import { MeeCarouselItem } from './carousel-item';

@Directive({
  selector: '[meeCarouselContainer]',
  hostDirectives: [Drag],
})
export class MeeCarouselContainer {
  readonly el = inject(ElementRef<HTMLElement>);

  get width() {
    return this.el.nativeElement.clientWidth;
  }
}

@Directive({
  selector: '[meeCarouselSubContainer]',
})
export class MeeCarouselSubContainer {
  private el = inject(ElementRef<HTMLElement>);
  private dir = injectDirectionality();

  updateScrollPosition(x: number, skipDirection = false) {
    const el = this.el.nativeElement;
    if (this.dir.isRtl() && !skipDirection) {
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    } else {
      el.style.transform = `translate3d(${-x}px, 0, 0)`;
    }
  }
}

@Directive({
  selector: '[meeCarousel]',
  exportAs: 'meeCarousel',
})
export class MeeCarousel {
  private drag = viewChild.required(Drag);
  private dir = injectDirectionality();
  private mainContainer = viewChild.required(MeeCarouselContainer);
  private subContainer = viewChild.required(MeeCarouselSubContainer);
  private items = contentChildren(MeeCarouselItem);
  readonly current = signal(0);
  private animationId = 0;
  // this can be overridden by the ui carousel component
  velocity = 1.1;

  readonly itemsPerStep = computed(() => {
    const _ = this.isReady();
    const items = this.items();
    // const totalWidth = this.totalWidth();
    const containerWidth = this.containerWidth;
    // const scrollableWidth = totalWidth - containerWidth || 1;
    const v = Math.ceil(containerWidth / (items[0].width || 1));
    return v;
  });

  private readonly totalWidth = computed(() => {
    const _ = this.isReady();
    const items = this.items();
    return items.reduce((acc, item) => acc + item.width, 0);
  });

  /**
   * This is the total number of steps that can be taken.
   * It is computed based on the container width and the width of the last item.
   * It is used to determine the number of steps that can be taken.
   * We have to consider gap between items like padding or margin or flex gap.
   */
  readonly totalSteps = computed(() => {
    // const containerWidth = this.containerWidth;
    const items = this.items();
    if (!items.length || !this.itemsPerStep()) return 0;

    // console.log('totalSteps', items.length, this.itemsPerStep());

    // const totalWidth = this.totalWidth();
    // const scrollableWidth = totalWidth;

    // if (scrollableWidth <= 0) return 1; // All items fit in container

    // // Calculate effective step size based on the smallest item width
    // // const minItemWidth = Math.min(...items.map(item => item.width));
    // const v = Math.max(1, Math.floor(scrollableWidth / containerWidth));
    // console.log('totalSteps', v, scrollableWidth, containerWidth, scrollableWidth / containerWidth);
    // return v;
    const itemsPerStep = this.itemsPerStep();
    // const totalWidth = this.totalWidth();
    // const scrollableWidth = totalWidth - this.containerWidth;
    // return Math.max(1, Math.floor(scrollableWidth / itemsPerStep));
    return Math.ceil(items.length / itemsPerStep);
  });

  private readonly isReady = signal(false, { equal: () => false });
  readonly isFirst = computed(() => this.current() === 0);
  readonly isLast = computed(() => this.current() === this.totalSteps() - 1);
  private currentScroll = 0;

  constructor() {
    afterNextRender(() => {
      this.isReady.set(true);
      this.drag().events.subscribe(event => {
        event.event?.preventDefault();
        requestAnimationFrame(() => {
          if (event.type === 'start') {
            cancelAnimationFrame(this.animationId);
            this.currentScroll = this.x();
          } else if (event.type === 'move') {
            this.currentScroll = this.x() - event.x;
            this.subContainer().updateScrollPosition(this.currentScroll, true);
          } else if (event.type === 'end') {
            const step = this.getStepBasedOnX(
              this.currentScroll,
              event.direction!,
              event.velocity!, // Convert to pixels/second
            );
            this.go(step, event.velocity!);
          }
        });
      });
    });

    effect(cleanup => {
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
          requestAnimationFrame(() => this.isReady.set(true));
        });
        observer.observe(this.mainContainer().el.nativeElement);
        cleanup(() => observer.disconnect());
      }
    });

    // if the total steps changes, we need to update the current step
    // also make sure the most visible item is the current item
    effect(() => {
      const totalSteps = this.totalSteps();
      const _ = this.dir.isRtl();
      const __ = this.isReady();
      // console.log('effect', totalSteps, this.itemsPerStep());
      untracked(() => {
        const current = this.current();
        const step = current >= totalSteps ? totalSteps - 1 : current;
        this.go(step, this.velocity, true);
      });
    });
  }

  x() {
    const current = this.current() * this.itemsPerStep();
    const items = this.items();
    if (this.containerWidth > this.totalWidth()) return 0;

    const totalWidth = this.totalWidth() - this.containerWidth;

    const x = items.slice(0, current).reduce((a, item) => a + item.width, 0);
    return Math.min(x, totalWidth);
  }

  private get containerWidth() {
    return this.mainContainer().width;
  }

  next(step = 1) {
    const current = this.current();
    const nextStep = Math.min(current + step, this.totalSteps() - 1);
    this.go(nextStep);
  }

  prev(step = 1) {
    const current = this.current();
    const index = Math.max(current - step, 0);
    this.go(index);
  }

  go(step: number, velocity = this.velocity, withoutAnimation = false) {
    // const totalSteps = this.totalSteps();
    if (step < 0 || step >= this.totalSteps()) {
      console.log('out of bounds step', step, this.totalSteps());
      return;
    }
    this.current.set(step);
    this.animateToX(velocity, withoutAnimation); // Adjust the scaling factor as needed
  }

  /**
   * Determines the appropriate step based on scroll position, direction and velocity
   * @param scrollX Current scroll position
   * @param direction Drag direction
   * @param velocity Drag velocity
   * @returns The calculated step index
   */
  private getStepBasedOnX(scrollX: number, direction: 'left' | 'right', velocity: number): number {
    const currentStep = this.current();
    const totalSteps = this.totalSteps();
    const isRtl = this.dir.isRtl();

    // In RTL mode, invert the direction
    const effectiveDirection = isRtl ? (direction === 'left' ? 'right' : 'left') : direction;

    // Prevent movement on last step when trying to go forward
    if (currentStep === totalSteps - 1 && effectiveDirection === 'left') {
      return currentStep;
    }

    // Use velocity to determine step change
    const VELOCITY_THRESHOLD = 0.3;
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (effectiveDirection === 'left') {
        return Math.min(currentStep + 1, totalSteps - 1);
      } else {
        return Math.max(currentStep - 1, 0);
      }
    }

    // If velocity is low, stay at current step
    return currentStep;
  }

  // private updateScrollPosition(x = this.currentScroll) {
  //   const el = this.subContainer().nativeElement;
  //   if (this.dir.isRtl()) {
  //     el.style.transform = `translate3d(${x}px, 0, 0)`;
  //   } else {
  //     el.style.transform = `translate3d(${-x}px, 0, 0)`;
  //   }
  // }

  private animateToX(velocity: number, withoutAnimation = false) {
    velocity = Math.max(velocity, this.velocity);
    let lastTime = Date.now();
    const targetScroll = this.x();
    const startScroll = this.currentScroll;
    const isRtl = this.dir.isRtl();

    // In RTL, invert the distance calculation
    const distance = isRtl ? startScroll - targetScroll : targetScroll - startScroll;
    const duration = Math.abs(distance / velocity);
    let elapsedTime = 0;

    const easeOutQuad = (t: number) => t * (2 - t);
    const subContainer = this.subContainer();

    const animate = () => {
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      elapsedTime += dt;

      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutQuad(progress);

      // Calculate scroll position based on direction
      this.currentScroll = isRtl
        ? startScroll - distance * easedProgress
        : startScroll + distance * easedProgress;

      subContainer.updateScrollPosition(this.currentScroll);

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(this.animationId);
    if (!withoutAnimation) {
      this.animationId = requestAnimationFrame(animate);
    } else {
      this.currentScroll = targetScroll;
      subContainer.updateScrollPosition(this.currentScroll);
    }
  }

  private snapToNearest(velocity = this.velocity) {
    const items = this.items();
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < items.length; i++) {
      const itemPosition = items.slice(0, i).reduce((acc, item) => acc + item.width, 0);
      const distance = Math.abs(this.currentScroll - itemPosition);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    const step = Math.floor(nearestIndex / this.itemsPerStep());

    this.go(step, velocity);
    // this.current.set(nearestIndex);
    // this.currentScroll = this.x();
    // this.updateScrollPosition();
  }
}

export function provideCarousel(carousel: typeof MeeCarousel) {
  return { provide: MeeCarousel, useExisting: carousel };
}
