import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  contentChildren,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Drag } from '@meeui/ui/drag';
import { Directionality } from '@meeui/ui/adk';
import { CarouselItem } from './carousel-item';

const DEFAULT_VELOCITY = 0.7;

@Component({
  selector: 'mee-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Drag],
  template: `
    <div class="touch-none overflow-hidden" meeDrag #mainContainer>
      <div #subContainer class="relative flex">
        <ng-content select="[meeCarouselItem]" />
      </div>
    </div>
    <div>
      <ng-content />
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 relative',
  },
})
export class Carousel {
  private dir = inject(Directionality);
  private drag = viewChild.required(Drag);
  private mainContainer = viewChild.required<ElementRef<HTMLElement>>('mainContainer');
  private subContainer = viewChild.required<ElementRef<HTMLElement>>('subContainer');
  private items = contentChildren(CarouselItem);
  readonly current = signal(0);
  private animationId = 0;

  private readonly totalWidth = computed(() => {
    const _ = this.isReady();
    const items = this.items();
    return items.reduce((acc, item) => acc + item.width, 0);
  });

  readonly totalSteps = computed(() => {
    const containerWidth = this.containerWidth;
    const items = this.items();
    const totalWidth = this.totalWidth();
    const lastItem = items[items.length - 1];
    return Math.ceil((totalWidth - containerWidth) / lastItem.width + 1);
  });

  readonly isReady = signal(false);
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
            this.updateScrollPosition(-this.currentScroll);
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
  }

  x() {
    const current = this.current();
    const items = this.items();
    const totalWidth = this.totalWidth() - this.containerWidth;

    const x = items.slice(0, current).reduce((a, item) => a + item.width, 0);
    return Math.min(x, totalWidth);
  }

  private get containerWidth() {
    return this.mainContainer().nativeElement.clientWidth;
  }

  next(step = 1) {
    const current = this.current();
    const index = Math.min(current + step, this.totalSteps() - 1);
    this.go(index);
  }

  prev(step = 1) {
    const current = this.current();
    const index = Math.max(current - step, 0);
    this.go(index);
  }

  go(index: number, velocity = DEFAULT_VELOCITY) {
    const totalSteps = this.totalSteps();
    if (index < 0 || index >= totalSteps) {
      console.log('out of bounds');
      return;
    }
    this.current.set(index);
    this.animateToX(velocity); // Adjust the scaling factor as needed
  }

  private getStepBasedOnX(x: number, direction: 'left' | 'right', velocity: number) {
    const items = this.items();
    let accumulatedWidth = 0;
    let newIndex = 0;

    for (let i = 0; i < items.length; i++) {
      accumulatedWidth += items[i].width;
      console.log('accumulatedWidth', accumulatedWidth, x, i);
      if (accumulatedWidth > x) {
        newIndex = i + (direction === 'left' ? 0 : 1);
        break;
      }
    }

    const threshold = 0.3; // Adjust this value to change sensitivity
    if (direction === 'left' && velocity > threshold) {
      newIndex = Math.min(newIndex + 1, items.length - 1);
    } else if (direction === 'right' && velocity > threshold) {
      newIndex = Math.max(newIndex - 1, 0);
    }

    return newIndex;
  }

  private updateScrollPosition(x = this.currentScroll) {
    const el = this.subContainer().nativeElement;
    if (this.dir.isRtl()) {
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    } else {
      el.style.transform = `translate3d(${-x}px, 0, 0)`;
    }
  }

  private animateToX(velocity: number) {
    velocity = Math.max(velocity, DEFAULT_VELOCITY);
    console.log('velocity', velocity);
    let lastTime = Date.now();
    const targetScroll = this.x();
    const startScroll = this.currentScroll;
    const distance = targetScroll - startScroll;
    const duration = Math.abs(distance / velocity);
    let elapsedTime = 0;

    const easeOutQuad = (t: number) => t * (2 - t);

    const animate = () => {
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      elapsedTime += dt;

      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutQuad(progress);

      this.currentScroll = startScroll + distance * easedProgress;
      this.updateScrollPosition();

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        // this.snapToNearest();
      }
    };

    this.animationId = requestAnimationFrame(animate);
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

    this.go(nearestIndex, velocity);
    // this.current.set(nearestIndex);
    // this.currentScroll = this.x();
    // this.updateScrollPosition();
  }
}
