import {
  Component,
  ElementRef,
  computed,
  signal,
  ChangeDetectionStrategy,
  viewChild,
  effect,
  Directive,
  input,
  inject,
  contentChildren,
} from '@angular/core';
import { Drag, DragData } from '@meeui/adk/drag';
import { isClient } from '@meeui/adk/utils';

export type ScrollBarOrientation = 'vertical' | 'horizontal' | 'both';

@Directive({
  selector: '[meeScrollBar]',
  hostDirectives: [Drag],
  host: {
    style: `position: absolute; cursor: pointer;`,
    '[style]': 'size()',
    '[attr.data-visible]': 'visible()',
    '[attr.data-active]': 'scrollArea.isDragging()',
    '[hidden]': '!show()',
  },
})
export class MeeScrollBar {
  readonly el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  readonly scrollArea = inject(MeeScrollArea);
  readonly drag = inject(Drag);
  readonly meeScrollBar = input.required<'vertical' | 'horizontal'>();

  readonly visible = computed(() => {
    return this.meeScrollBar() === 'vertical'
      ? this.scrollArea.showVerticalScroll()
      : this.scrollArea.showHorizontalScroll();
  });

  readonly show = computed(() => {
    return this.meeScrollBar() === 'vertical'
      ? this.scrollArea.showVerticalBar()
      : this.scrollArea.showHorizontalBar();
  });

  readonly size = computed(() => {
    let sty =
      this.meeScrollBar() === 'vertical'
        ? `height: ${this.scrollArea.scrollbarHeight()}%;`
        : `width: ${this.scrollArea.scrollbarWidth()}%;`;
    sty +=
      this.meeScrollBar() === 'vertical'
        ? 'width: 8px; top: 0; right: 0;'
        : 'height: 8px; bottom: 0; left: 0;';
    return sty;
  });

  constructor() {
    this.drag.events.subscribe(data => {
      if (this.meeScrollBar() === 'vertical') {
        this.scrollArea.startDraggingVertical(data);
      } else {
        this.scrollArea.startDraggingHorizontal(data);
      }
    });
  }
}

@Component({
  selector: '[meeScrollArea]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll-area-viewport hide-scrollbar" #scrollAreaViewport>
      <div class="scroll-area-content">
        <ng-content></ng-content>
      </div>
    </div>

    <ng-content select="[meeScrollBar]"></ng-content>

    <!-- Corner piece when both scrollbars are visible -->
    @if (hasVertical() && hasHorizontal() && orientation() === 'both') {
      <ng-content select=".scroll-area-corner"></ng-content>
    }
  `,
  styles: [
    `
      :host {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .scroll-area-viewport {
        width: 100%;
        height: 100%;
        overflow: auto;
        flex: 1;
        min-height: 0;
      }

      .scroll-area-viewport.hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .scroll-area-viewport.hide-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .scroll-area-content {
        min-height: 0;
        min-width: fit-content;
      }

      .scroll-area-corner {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
    `,
  ],
})
export class MeeScrollArea {
  readonly scrollAreaViewport =
    viewChild.required<ElementRef<HTMLDivElement>>('scrollAreaViewport');
  readonly scrollbars = contentChildren(MeeScrollBar);
  readonly scrollbarVertical = computed(() => {
    const scrollbars = this.scrollbars();
    return scrollbars.find(scrollbar => scrollbar.meeScrollBar() === 'vertical');
  });
  readonly scrollbarHorizontal = computed(() => {
    const scrollbars = this.scrollbars();
    return scrollbars.find(scrollbar => scrollbar.meeScrollBar() === 'horizontal');
  });

  readonly orientation = input<ScrollBarOrientation>('both');
  readonly hideDelay = input(1000); // Time in ms to hide scrollbar after scroll
  readonly alwaysShow = input(false); // Whether to always show the scrollbar

  private viewportHeight = signal(0);
  private viewportWidth = signal(0);
  private contentHeight = signal(0);
  private contentWidth = signal(0);
  private isScrolling = signal(false);
  private hideTimeout: any;
  private isDragging = signal(false);
  private startY = 0;
  private startX = 0;
  private startScrollTop = 0;
  private startScrollLeft = 0;
  private client = isClient();

  protected readonly showScrollbar = computed(() => {
    return this.alwaysShow() || this.isScrolling() || this.isDragging();
  });

  protected readonly hasVertical = computed(() => this.contentHeight() > this.viewportHeight());
  protected readonly hasHorizontal = computed(() => this.contentWidth() > this.viewportWidth());

  readonly showVerticalBar = computed(
    () => this.hasVertical() && this.orientation() !== 'horizontal',
  );
  readonly showHorizontalBar = computed(
    () => this.hasHorizontal() && this.orientation() !== 'vertical',
  );

  readonly showVerticalScroll = computed(() => this.showVerticalBar() && this.showScrollbar());
  readonly showHorizontalScroll = computed(() => this.showHorizontalBar() && this.showScrollbar());

  readonly scrollbarHeight = computed(() => {
    const viewportToContentRatio = this.viewportHeight() / this.contentHeight();
    return Math.max(viewportToContentRatio * 100, 10); // Minimum 10% height
  });

  readonly scrollbarWidth = computed(() => {
    const viewportToContentRatio = this.viewportWidth() / this.contentWidth();
    return Math.max(viewportToContentRatio * 100, 10); // Minimum 10% width
  });

  constructor() {
    effect(cleanup => {
      this.updateDimensions();
      const viewport = this.scrollAreaViewport().nativeElement;

      if (this.client) {
        viewport.addEventListener('scroll', this.handleScroll);
        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => {
          this.updateDimensions();
        });

        resizeObserver.observe(viewport);
        resizeObserver.observe(viewport.firstElementChild as Element);

        cleanup(() => {
          viewport.removeEventListener('scroll', this.handleScroll);
          resizeObserver.disconnect();
        });
      }
    });
  }

  private updateDimensions() {
    const viewport = this.scrollAreaViewport().nativeElement;
    this.viewportHeight.set(viewport.clientHeight);
    this.viewportWidth.set(viewport.clientWidth);
    this.contentHeight.set(viewport.scrollHeight);
    this.contentWidth.set(viewport.scrollWidth);
  }

  private handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    this.isScrolling.set(true);

    this.scrollbarVerticalTransform(target.scrollTop);
    this.scrollbarHorizontalTransform(target.scrollLeft);
    // Clear existing timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Set new timeout to hide scrollbar
    this.hideTimeout = setTimeout(() => {
      this.isScrolling.set(false);
    }, this.hideDelay());
  };

  private scrollbarVerticalTransform(scrollTop: number) {
    const scrollbar = this.scrollbarVertical()?.el.nativeElement;
    if (!scrollbar) return;
    const scrollRatio = scrollTop / (this.contentHeight() - this.viewportHeight());
    const maxTranslate =
      this.viewportHeight() - (this.viewportHeight() * this.scrollbarHeight()) / 100;
    const translateY = scrollRatio * maxTranslate;
    scrollbar.style.transform = `translateY(${translateY}px)`;
  }

  private scrollbarHorizontalTransform(scrollLeft: number) {
    const scrollbar = this.scrollbarHorizontal()?.el.nativeElement;
    if (!scrollbar) return;
    const scrollRatio = scrollLeft / (this.contentWidth() - this.viewportWidth());
    const maxTranslate =
      this.viewportWidth() - (this.viewportWidth() * this.scrollbarWidth()) / 100;
    const translateX = scrollRatio * maxTranslate;
    scrollbar.style.transform = `translateX(${translateX}px)`;
  }

  startDraggingVertical(data: DragData) {
    data.event?.preventDefault();
    if (data.type === 'start') {
      this.startScrollTop = this.scrollAreaViewport().nativeElement.scrollTop;
      this.isDragging.set(true);
      this.startY = data.clientY!;
    } else if (data.type === 'end') {
      this.isDragging.set(false);
    }

    const delta = data.clientY! - this.startY;
    const scrollRatio =
      delta / (this.viewportHeight() - (this.viewportHeight() * this.scrollbarHeight()) / 100);
    const balance = this.contentHeight() - this.viewportHeight();
    const newScrollTop = this.startScrollTop + scrollRatio * balance;

    const value = Math.max(0, Math.min(newScrollTop, balance));

    this.scrollAreaViewport().nativeElement.scrollTop = value;
  }

  startDraggingHorizontal(data: DragData) {
    data.event?.preventDefault();
    if (data.type === 'start') {
      this.startScrollLeft = this.scrollAreaViewport().nativeElement.scrollLeft;
      this.isDragging.set(true);
      this.startX = data.clientX!;
    } else if (data.type === 'end') {
      this.isDragging.set(false);
    }

    const delta = data.clientX! - this.startX;
    const scrollRatio =
      delta / (this.viewportWidth() - (this.viewportWidth() * this.scrollbarWidth()) / 100);
    const balance = this.contentWidth() - this.viewportWidth();
    const newScrollLeft = this.startScrollLeft + scrollRatio * balance;

    const value = Math.max(0, Math.min(newScrollLeft, balance));

    this.scrollAreaViewport().nativeElement.scrollLeft = value;
  }
}
