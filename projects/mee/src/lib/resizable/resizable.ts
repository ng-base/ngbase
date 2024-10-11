import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
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
import { Subscription } from 'rxjs';
import { DOCUMENT, NgClass } from '@angular/common';
import { ResizableGroup } from './resizable-group';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { Icon } from '../icon';

@Component({
  selector: 'mee-resizable',
  standalone: true,
  imports: [Drag, Icon, NgClass],
  template: `<ng-content></ng-content>
    <ng-template #dragElement>
      @if (draggable()) {
        <div
          meeDrag
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
          ></mee-icon>
        </div>
      }
    </ng-template>`,
  host: {
    class: 'relative overflow-hidden block flex-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGripVertical })],
})
export class Resizable implements OnDestroy {
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  resizable = inject(ResizableGroup);
  containerRef = inject(ViewContainerRef);
  drag = viewChild(Drag);
  size = model<number | string>('auto');
  dragElement = viewChild('dragElement', { read: TemplateRef });
  reducedSize = 0;
  draggable = signal(false);
  index = 0;
  sub?: Subscription;
  str = '';
  parentRect!: DOMRect;
  min = 0;
  max = 0;

  constructor() {
    effect(
      () => {
        const _ = this.size();
        untracked(() => this.handleDrag());
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const cf = this.containerRef;
        if (this.draggable() && this.size()) {
          if (cf.length === 0) {
            untracked(() => cf.createEmbeddedView(this.dragElement()!));
          }
        } else {
          cf.clear();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      cleanup => {
        cleanup(() => this.sub?.unsubscribe());
        const drag = this.drag();

        untracked(() => {
          if (drag) {
            this.sub = drag.events.subscribe((data: DragData) => {
              if (data.type === 'start') {
                this.resizable.start();
                this.parentRect = this.el.nativeElement.getBoundingClientRect();
                this.min = this.parentRect.left;
                this.max = this.parentRect.left + this.parentRect.width;
              } else if (data.type === 'end') {
                this.resizable.end();
              }
              this.onDrag(data);
            });
          }
        });
      },
      { allowSignalWrites: true },
    );
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

    first.updateSize(x);
    second?.updateSize(-x);
    if (updateAuto) {
      this.resizable.setAuto();
    }
  }

  updateSize(px: number) {
    this.reducedSize -= px;
    this.updateFlex();
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

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
