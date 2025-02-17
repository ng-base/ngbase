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

const DEFAULT_VELOCITY = 1.1;

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

  updateScrollPosition(x: number) {
    const el = this.el.nativeElement;
    if (this.dir.isRtl()) {
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
  private mainContainer = viewChild.required(MeeCarouselContainer);
  private subContainer = viewChild.required(MeeCarouselSubContainer);
  private items = contentChildren(MeeCarouselItem);
  readonly current = signal(0);
  private animationId = 0;

  private readonly itemsPerStep = computed(() => {
    const _ = this.isReady();
    const items = this.items();
    const containerWidth = this.containerWidth;
    const totalWidth = this.totalWidth();
    const scrollableWidth = totalWidth - containerWidth || 1;
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
    const containerWidth = this.containerWidth;
    const items = this.items();
    if (!items.length) return 0;

    const totalWidth = this.totalWidth();
    const scrollableWidth = totalWidth - containerWidth;

    if (scrollableWidth <= 0) return 1; // All items fit in container

    // Calculate effective step size based on the smallest item width
    // const minItemWidth = Math.min(...items.map(item => item.width));
    return Math.max(1, Math.ceil(scrollableWidth / containerWidth));
  });

  readonly isReady = signal(false, { equal: () => false });
  readonly isFirst = computed(() => this.current() === 0);
  readonly isLast = computed(() => this.current() === this.totalSteps() - 1);
  currentScroll = 0;

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
            this.subContainer().updateScrollPosition(this.currentScroll);
          } else if (event.type === 'end') {
            const step = this.getStepBasedOnX(
              this.currentScroll,
              event.direction!,
              event.velocity!, // Convert to pixels/second
            );
            if (step === this.current()) {
              this.snapToNearest();
              return;
            }
            this.go(step, event.velocity!);
          }
        });
      });
    });

    effect(cleanup => {
      const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => this.isReady.set(true));
      });
      observer.observe(this.mainContainer().el.nativeElement);
      cleanup(() => observer.disconnect());
    });

    // if the total steps changes, we need to update the current step
    // also make sure the most visible item is the current item
    effect(() => {
      const totalSteps = this.totalSteps();
      const _ = this.isReady();
      untracked(() => {
        const current = this.current();
        const step = current >= totalSteps ? totalSteps - 1 : current;
        this.go(step, DEFAULT_VELOCITY, true);
      });
    });
  }

  x() {
    const current = this.current() * this.itemsPerStep();
    const items = this.items();
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

  go(step: number, velocity = DEFAULT_VELOCITY, withoutAnimation = false) {
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
    const items = this.items();
    const containerWidth = this.containerWidth;

    // Calculate visible range
    const visibleStart = scrollX;
    const visibleEnd = scrollX + containerWidth;

    // Find the most visible item
    let accumulatedWidth = 0;
    let mostVisibleIndex = 0;
    let maxVisibleWidth = 0;

    for (let i = 0; i < items.length; i++) {
      const itemStart = accumulatedWidth;
      const itemEnd = itemStart + items[i].width;

      // Calculate how much of the item is visible
      const visibleWidth = Math.min(itemEnd, visibleEnd) - Math.max(itemStart, visibleStart);

      if (visibleWidth > maxVisibleWidth) {
        maxVisibleWidth = visibleWidth;
        mostVisibleIndex = i;
      }

      accumulatedWidth += items[i].width;
    }

    // Apply velocity-based adjustments
    const VELOCITY_THRESHOLD = 0.3;
    let targetIndex = mostVisibleIndex;

    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      const velocityAdjustment = direction === 'left' ? 1 : -1;
      targetIndex += velocityAdjustment;
    }

    const step = Math.floor(targetIndex / this.itemsPerStep());

    // Clamp the target index to valid range
    return Math.max(0, Math.min(step, this.totalSteps() - 1));
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
    velocity = Math.max(velocity, DEFAULT_VELOCITY);
    let lastTime = Date.now();
    const targetScroll = this.x();
    const startScroll = this.currentScroll;
    const distance = targetScroll - startScroll;
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

      this.currentScroll = startScroll + distance * easedProgress;
      subContainer.updateScrollPosition(this.currentScroll);

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        // this.snapToNearest();
      }
    };

    if (!withoutAnimation) {
      this.animationId = requestAnimationFrame(animate);
    } else {
      this.currentScroll = targetScroll;
      subContainer.updateScrollPosition(this.currentScroll);
    }
  }

  private snapToNearest(velocity = DEFAULT_VELOCITY) {
    console.log('snapToNearest');
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
