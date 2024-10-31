import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DragData, Drag } from '../drag';
import { NgClass } from '@angular/common';
import { ResizableGroup } from './resizable-group';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { Icon } from '../icon';

@Component({
  standalone: true,
  selector: 'mee-resizable',
  imports: [Drag, Icon, NgClass],
  template: `<ng-content />
    <ng-template #dragElement>
      @if (draggable()) {
        <div
          meeDrag
          [dragBoundary]="'#' + resizable.id"
          class="dragElement relative flex cursor-ew-resize items-center justify-center after:absolute after:top-0"
          [ngClass]="
            resizable.direction() === 'vertical'
              ? 'bottom-0 left-0 h-0 w-full cursor-ns-resize border-b after:-mt-b after:h-b2 after:w-full'
              : 'right-0 top-0 w-0 cursor-ew-resize border-l after:h-full after:w-b2'
          "
        >
          <mee-icon
            name="lucideGripVertical"
            class="z-30 rounded-base border bg-muted-background py-0.5"
            size=".75rem"
            [class]="resizable.direction() === 'vertical' ? 'rotate-90' : ''"
          />
        </div>
      }
    </ng-template>`,
  host: {
    class: 'relative overflow-hidden block flex-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGripVertical })],
})
export class Resizable {
  // Dependencies
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly resizable = inject(ResizableGroup);
  readonly containerRef = inject(ViewContainerRef);
  readonly dragElement = viewChild('dragElement', { read: TemplateRef });
  readonly drag = viewChild(Drag);

  // inputs
  readonly size = model<number | string>('auto');

  readonly draggable = signal(false);
  private reducedSize = 0;
  index = 0;
  str = '';
  private parentRect?: DOMRect;
  private parentWidth = 0;
  private min = 0;
  private start = 0;

  constructor() {
    effect(() => {
      const _ = this.size();
      untracked(() => this.handleDrag());
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
          if (data.type === 'start') {
            this.resizable.start();
            this.parentRect = this.el.nativeElement.getBoundingClientRect();
            this.parentWidth = this.parentRect.width + this.reducedSize;
            this.min = this.parentRect.left;
            this.start = this.parentRect.left + this.parentRect.width;
          } else if (data.type === 'end') {
            this.resizable.end();
            this.parentRect = undefined;
            this.min = 0;
            this.start = 0;
          }
          this.onDrag(data);
        });
        cleanup(() => sub.unsubscribe());
      });
    });
  }

  get w() {
    return this.el.nativeElement.clientWidth;
  }

  get h() {
    return this.el.nativeElement.clientHeight;
  }

  onDrag(data: DragData) {
    data.event?.preventDefault();
    requestAnimationFrame(() => this.handleDrag(data));
  }

  handleDrag(event = { dx: 0, dy: 0 } as DragData, updateAuto = true) {
    // if (event.clientX! - this.min < 0) {
    //   return;
    // }
    const panels = this.resizable.panels();
    const isHorizontal = this.resizable.direction() === 'horizontal';

    const first = panels[this.index];
    const second = panels[this.index + 1];
    const x = isHorizontal ? event.dx : event.dy;

    if (first.updateSize(x)) {
      second?.updateSize(-x);
    }
    if (updateAuto) {
      this.resizable.setAuto();
    }
  }

  updateSize(px: number) {
    // this.reducedSize -= px;
    // console.log({
    //   width: this.parentRect?.width ?? Infinity,
    //   rSize: this.reducedSize - px,
    //   index: this.index,
    // });
    const size = Math.min(this.parentWidth ?? Infinity, this.reducedSize - px);
    console.log({ size, rs: this.reducedSize, pw: this.parentWidth, i: this.index });
    if (size && size === this.reducedSize) return false;
    this.reducedSize = size;
    // console.log(this.reducedSize, this.min, this.start, this.parentRect?.width);
    this.updateFlex();
    return true;
  }

  updateFlex() {
    let size = '';
    if (this.size() && typeof this.size() === 'number') {
      size = `${this.size()}%`;
    } else if (this.size() !== 'auto') {
      size = this.size() as string;
    }
    this.updateElementSize(
      size ? (this.reducedSize ? `calc(${size} - ${this.reducedSize}px)` : size) : '',
    );
  }

  updateElementSize(str: string) {
    this.str = str || '0px';
    if (this.resizable.direction() === 'horizontal') {
      this.el.nativeElement.style.width = this.str;
    } else {
      this.el.nativeElement.style.height = this.str;
    }
  }
}
