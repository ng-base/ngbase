import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Drag, DragData } from '@ngbase/adk/drag';
import { NgbResizableGroup } from './resizable-group';

@Directive({
  selector: '[ngbGutter]',
  exportAs: 'ngbGutter',
  hostDirectives: [Drag],
  host: {
    role: 'separator',
    '[attr.aria-valuemin]': 'resizable.min()',
    '[attr.aria-valuemax]': 'resizable.max()',
  },
})
export class NgbGutter {
  readonly resizable = inject(NgbResizable);
  readonly drag = inject(Drag);

  constructor() {
    this.drag._lockAxis = linkedSignal(this.resizable.lockAxis);
    this.drag._dragBoundary = linkedSignal(() => `#${this.resizable.id}`);
  }
}

@Component({
  selector: '[ngbResizable]',
  exportAs: 'ngbResizable',
  imports: [Drag, NgbGutter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />
    <ng-template #dragElement>
      @if (draggable()) {
        <div
          ngbGutter
          class="{{
            'dragElement relative flex cursor-ew-resize items-center justify-center after:absolute after:top-0 ' +
              (resizable.direction() === 'vertical'
                ? 'bottom-0 left-0 h-0 w-full cursor-ns-resize border-b after:-mt-b after:h-b2 after:w-full'
                : 'right-0 top-0 w-0 cursor-ew-resize border-l after:h-full after:w-b2')
          }}"
        ></div>
      }
    </ng-template>`,
})
export class NgbResizable {
  // Dependencies
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly resizable = inject(NgbResizableGroup);
  readonly containerRef = inject(ViewContainerRef);
  readonly dragElement = viewChild('dragElement', { read: TemplateRef });
  readonly drag = viewChild(Drag);
  readonly id = this.resizable.id;
  readonly lockAxis = computed(() => (this.resizable.direction() === 'horizontal' ? 'x' : 'y'));

  // inputs
  readonly size = input<number | string>('auto');
  readonly min = input<number | string>(0);
  readonly max = input<number | string>();

  // State
  readonly lSize = linkedSignal({
    source: this.size,
    computation: size => (size !== 'auto' ? size : ''),
  });
  readonly draggable = signal(false);
  private reducedSize = 0;
  private localMinSize = Infinity;
  private localMaxSize = -Infinity;
  private lastReducedSize = 0;
  index = 0;
  str = '';

  constructor() {
    effect(() => {
      const size = this.size();
      untracked(() => {
        if (size !== 'auto') this.handleDrag();

        this.resizable.setAuto();
      });
    });

    // This effect is responsible for creating the gutter element
    effect(() => {
      const cf = this.containerRef;
      if (this.draggable() && this.size()) {
        if (cf.length === 0) {
          untracked(() => cf.createEmbeddedView(this.dragElement()!));
        }
      } else {
        cf.clear();
      }
    });

    // This effect is responsible for handling the drag events
    effect(cleanup => {
      const drag = this.drag();

      if (!drag) return;

      untracked(() => {
        const sub = drag.events.subscribe((data: DragData) => {
          data.event?.preventDefault();

          requestAnimationFrame(() => this.onDrag(data));
        });
        cleanup(() => sub.unsubscribe());
      });
    });
  }

  // get w() {
  //   return this.el.nativeElement.clientWidth;
  // }

  // get h() {
  //   return this.el.nativeElement.clientHeight;
  // }

  cSize() {
    return this.resizable.direction() === 'horizontal'
      ? this.el.nativeElement.offsetWidth
      : this.el.nativeElement.offsetHeight;
  }

  onStart() {
    const cSize = this.cSize();
    const minSize = this.getSize(this.min());
    this.localMinSize = cSize + this.reducedSize - minSize;
    if (this.max()) {
      const maxSize = this.getSize(this.max());
      this.localMaxSize = cSize + this.reducedSize - maxSize;
    }
    // console.log(`onStart ${this.index}`, this.min(), this.localMinSize, this.localMaxSize);
  }

  onEnd() {
    this.localMinSize = Infinity;
    this.localMaxSize = -Infinity;
    this.lastReducedSize = this.reducedSize;
  }

  private getSize(size?: number | string): number {
    if (!size) return 0;

    const minValue = size;
    if (typeof minValue === 'number') {
      // If number, treat as percentage
      return (
        (this.resizable.direction() === 'horizontal' ? this.resizable.w : this.resizable.h) *
        (minValue / 100)
      );
    }

    // Handle pixel values
    const pixelMatch = minValue?.toString().match(/(\d+)px/);
    if (pixelMatch) {
      return parseInt(pixelMatch[1], 10);
    }

    // Handle percentage values provided as string
    const percentMatch = minValue?.toString().match(/(\d+)%/);
    if (percentMatch) {
      return (
        (this.resizable.direction() === 'horizontal' ? this.resizable.w : this.resizable.h) *
        (parseInt(percentMatch[1], 10) / 100)
      );
    }

    return 0;
  }

  onDrag(data: DragData): void {
    if (data.type === 'start') {
      this.resizable.start();
    }

    // We have to call end method without calling handleDrag to avoid layout thrashing
    if (data.type === 'end') {
      this.resizable.end();
    } else {
      this.handleDrag(data);
    }
  }

  handleDrag(event = { x: 0, y: 0 } as DragData) {
    const isHorizontal = this.resizable.direction() === 'horizontal';

    let delta = isHorizontal ? event.x : event.y;
    delta -= this.lastReducedSize;

    const panels = this.resizable.panels();

    let remaining = -delta;
    for (let i = this.index; i >= 0; i--) {
      const panel = panels[i];
      remaining = panel.getUpdatedSize(remaining).remaining;
      if (remaining === 0) {
        break;
      }
    }
    delta = delta + remaining;
    remaining = delta;
    for (let i = this.index + 1; i < panels.length; i++) {
      const panel = panels[i];
      remaining = panel.getUpdatedSize(remaining).remaining;
      if (remaining === 0) {
        break;
      }
    }
    delta = delta - remaining;

    const current = panels[this.index];
    current.updateSize(delta, 'both');
  }

  private getUpdatedSize(px: number): { remaining: number; value: number } {
    const v = Math.max(Math.min(px, this.localMinSize), this.localMaxSize);
    return { remaining: px - v, value: v };
  }

  updateSize(px: number, direct: 'both' | 'prev' | 'next') {
    const prevSize = -px;
    const { remaining, value } = this.getUpdatedSize(prevSize);
    this.reducedSize = value;

    this.updateFlex();
    const isSame = prevSize !== this.reducedSize;

    const v = direct === 'both' ? px : remaining;

    if ((isSame && direct === 'next') || direct === 'both') {
      // console.log(`updateSize ${this.index}`, this.reducedSize, px, value, v);
      const next = this.resizable.panels()[this.index + 1];
      next?.updateSize(-v, 'next');
    }
    if (isSame && (direct === 'prev' || direct === 'both')) {
      const prev = this.resizable.panels()[this.index - 1];
      prev?.updateSize(v, 'prev');
    }
  }

  private calculateSize(): string {
    const size = this.lSize();

    const baseSize = typeof size === 'number' ? `${size}%` : size;

    if (this.reducedSize === 0) {
      return baseSize;
    }

    return `calc(${baseSize} - ${this.reducedSize}px)`;
  }

  private updateFlex() {
    const size = this.calculateSize();
    this.updateElementSize(size || '0px');
  }

  updateElementSize(str: string) {
    this.str = str;
    if (this.resizable.direction() === 'horizontal') {
      this.el.nativeElement.style.width = this.str;
    } else {
      this.el.nativeElement.style.height = this.str;
    }
  }
}

export function provideResizable(resizable: typeof NgbResizable) {
  return { provide: NgbResizable, useExisting: resizable };
}
