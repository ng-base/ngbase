import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  contentChildren,
  signal,
  viewChild,
} from '@angular/core';
import { CarouselItem } from './carousel-item.directive';
import { Drag } from '../drag';

@Component({
  standalone: true,
  selector: 'mee-carousel',
  imports: [Drag],
  template: `
    <div class="touch-none overflow-hidden" meeDrag #mainContainer>
      <div
        #subContainer
        class="relative flex transition-transform duration-500"
        [style.transform]="'translate3d(-' + x() + 'px, 0, 0)'"
      >
        <ng-content select="[meeCarouselItem]"></ng-content>
      </div>
    </div>
    <div>
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 relative',
  },
})
export class Carousel {
  private drag = viewChild(Drag);
  private mainContainer = viewChild<ElementRef<HTMLElement>>('mainContainer');
  private subContainer = viewChild<ElementRef<HTMLElement>>('subContainer');
  private items = contentChildren(CarouselItem);
  current = signal(0);

  x = computed(() => {
    const current = this.current();
    const items = this.items();
    const totalWidth = this.totalWidth() - this.containerWidth;

    const x = items.slice(0, current).reduce((a, item) => a + item.width, 0);
    return x > totalWidth ? totalWidth : x;
  });

  totalSteps = computed(() => {
    const containerWidth = this.containerWidth;
    const totalWidth = this.totalWidth();
    const items = this.items();
    const lastItem = items[items.length - 1];
    return Math.ceil((totalWidth - containerWidth) / lastItem.width + 1);
  });

  isFirst = computed(() => this.current() === 0);
  isLast = computed(() => this.current() === this.totalSteps() - 1);

  constructor() {
    afterNextRender(() => {
      let x = 0;
      const el = this.subContainer()!.nativeElement;
      this.drag()!.events.subscribe((event) => {
        event.event?.preventDefault();
        requestAnimationFrame(() => {
          if (event.type === 'start') {
            el.classList.remove('duration-500');
            x = -this.x();
          } else if (event.type === 'move') {
            x = -this.x() + event.x;
            el.style.transform = `translate3d(${x}px, 0, 0)`;
          } else if (event.type === 'end') {
            el.classList.add('duration-500');
            const step = this.getStepBasedOnX(
              -x,
              event.direction!,
              event.velocity!,
            );
            if (step === this.current()) {
              el.style.transform = `translate3d(-${this.x()}px, 0, 0)`;
              return;
            }
            this.animateToX(event.velocity!);
            this.go(step);
          }
        });
      });
    });
  }

  get containerWidth() {
    return this.mainContainer()!.nativeElement.clientWidth;
  }

  private totalWidth() {
    const items = this.items();
    return items.reduce((acc, item) => acc + item.width, 0);
  }

  next(step = 1) {
    const current = this.current();
    const index = current + step;
    this.go(index);
  }

  prev(step = 1) {
    const current = this.current();
    const index = current - step;
    this.go(index);
  }

  go(index: number) {
    const totalSteps = this.totalSteps();
    if (index < 0 || index >= totalSteps) {
      console.log('out of bounds');
      return;
    }
    this.current.set(index);
  }

  getStepBasedOnX(x: number, direction: 'left' | 'right', velocity: number) {
    const items = this.items();
    let stepItem = items[0];
    for (let item of items) {
      if (x < item.width) {
        stepItem = item;
        break;
      }
      x -= item.width;
    }
    let newIndex = items.indexOf(stepItem);
    const per = Math.ceil((x / stepItem.width) * 100);

    if (direction === 'left') {
      newIndex = per > 20 || velocity > 0.5 ? newIndex + 1 : newIndex;
      newIndex = Math.min(newIndex, items.length - 1);
    } else if (direction === 'right') {
      newIndex = per < 80 || velocity > 0.5 ? newIndex : newIndex + 1;
      newIndex = Math.max(newIndex, 0);
    }
    return newIndex;
  }

  animateToX(velocity: number) {
    const el = this.subContainer()!.nativeElement;
    el.classList.remove('duration-500');
    const v = velocity > 1 ? 1 : 1.3 - velocity;
    let duration = v * 0.5;
    duration = duration > 0.5 ? 0.5 : duration;
    el.style.transition = `transform ${duration}s ease-out`;
    el.addEventListener('transitionend', () => {
      el.classList.add('duration-500');
    });
  }
}
