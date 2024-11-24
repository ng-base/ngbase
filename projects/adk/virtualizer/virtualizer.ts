import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
  TemplateRef,
} from '@angular/core';
import { cleanup, isClient } from '@meeui/adk/utils';

export type Orientation = 'vertical' | 'horizontal';

export interface VirtualForContext<T> {
  $implicit: T;
  index: number;
}

@Directive({
  selector: '[virtualFor][virtualForOf]',

  host: {
    class: 'block',
  },
})
export class VirtualFor<T> {
  public template = inject<TemplateRef<VirtualForContext<T>>>(TemplateRef);
  readonly virtualForOf = input.required<T[]>();
}

interface VirtualItem {
  index: number;
  position: number;
}

@Component({
  selector: 'mee-virtualizer, [meeVirtualizer]',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="virtualizer-content absolute left-0 top-0"
      [class.w-full]="isVertical()"
      [class.h-full]="!isVertical()"
      [style.height.px]="isVertical() ? totalContentSize() : '100%'"
      [style.width.px]="!isVertical() ? totalContentSize() : '100%'"
    >
      @for (item of visibleItems(); track item.index) {
        <div
          class="virtualizer-item absolute"
          [class.w-full]="isVertical()"
          [class.h-full]="!isVertical()"
          [style.transform]="getTransform(item)"
          [style.height.px]="isVertical() ? itemSize() : '100%'"
          [style.width.px]="!isVertical() ? itemSize() : '100%'"
        >
          <ng-container
            [ngTemplateOutlet]="virtualFor().template"
            [ngTemplateOutletContext]="{
              $implicit: this.items()[item.index],
              index: item.index,
            }"
          >
          </ng-container>
        </div>
      }
    </div>
  `,
  host: {
    class: 'block relative overflow-auto contain-strict',
    '(scroll)': 'onScroll($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class Virtualizer<T> {
  private readonly containerRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly virtualFor = contentChild.required<VirtualFor<T>>(VirtualFor);

  // Input signals
  readonly itemSize = input.required({ transform: numberAttribute });
  readonly buffer = input(2);
  readonly orientation = input<Orientation>('vertical');

  // Internal signals
  private readonly scrollPosition = signal(0);
  private readonly containerSize = signal(0);

  // Computed values
  readonly items = computed(() => this.virtualFor().virtualForOf());
  private readonly totalItems = computed(() => this.items().length);
  readonly totalContentSize = computed(() => this.totalItems() * this.itemSize());

  readonly isVertical = computed(() => this.orientation() === 'vertical');

  private readonly visibleIndexes = computed(() => {
    const start = Math.floor(this.scrollPosition() / this.itemSize());
    const visibleCount = Math.ceil(this.containerSize() / this.itemSize());

    const bufferSize = this.buffer();
    const startIndex = Math.max(0, start - bufferSize);
    const endIndex = Math.min(this.totalItems(), start + visibleCount + bufferSize);

    return { startIndex, endIndex };
  });

  readonly visibleItems = computed(() => {
    const { startIndex, endIndex } = this.visibleIndexes();
    const items: VirtualItem[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      items.push({
        index: i,
        position: i * this.itemSize(),
      });
    }

    return items;
  });

  private readonly client = isClient();

  constructor() {
    this.updateContainerSize();

    if (this.client) {
      const resizeObserver = new ResizeObserver(() => {
        this.updateContainerSize();
      });
      resizeObserver.observe(this.containerRef.nativeElement);
      cleanup(() => resizeObserver.disconnect());
    }
  }

  getTransform(item: VirtualItem): string {
    return this.isVertical() ? `translateY(${item.position}px)` : `translateX(${item.position}px)`;
  }

  onScroll(event: UIEvent) {
    const target = event.target as HTMLElement;
    this.scrollPosition.set(this.isVertical() ? target.scrollTop : target.scrollLeft);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = Math.floor(this.scrollPosition() / this.itemSize());

    let nextIndex = currentIndex;
    if (this.isVertical()) {
      nextIndex =
        event.key === 'ArrowDown'
          ? Math.min(currentIndex + 1, this.totalItems() - 1)
          : event.key === 'ArrowUp'
            ? Math.max(0, currentIndex - 1)
            : currentIndex;
    } else {
      nextIndex =
        event.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, this.totalItems() - 1)
          : event.key === 'ArrowLeft'
            ? Math.max(0, currentIndex - 1)
            : currentIndex;
    }

    this.scrollToIndex(nextIndex);
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
    const position = index * this.itemSize();
    if (this.isVertical()) {
      this.containerRef.nativeElement.scrollTo({
        top: position,
        behavior,
      });
    } else {
      this.containerRef.nativeElement.scrollTo({
        left: position,
        behavior,
      });
    }
  }

  private updateContainerSize() {
    this.containerSize.set(
      this.isVertical()
        ? this.containerRef.nativeElement.clientHeight
        : this.containerRef.nativeElement.clientWidth,
    );
  }
}
