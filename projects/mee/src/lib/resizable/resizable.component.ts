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
import { ResizableGroup } from './resizable-group.component';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { Icons } from '../icon';

@Component({
  selector: 'mee-resizable',
  standalone: true,
  imports: [Drag, Icons, NgClass],
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
            class="z-10 rounded-base border bg-muted-background py-0.5"
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
  document = inject(DOCUMENT);
  drag = viewChild(Drag);
  size = model<number | string>('auto');
  dragElement = viewChild('dragElement', { read: TemplateRef });
  reducedSize = 0;
  draggable = signal(false);
  index = 0;
  sub?: Subscription;
  str = '';

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
      () => {
        const drag = this.drag();
        this.sub?.unsubscribe();

        untracked(() => {
          if (drag) {
            this.sub = drag.events.subscribe((data: DragData) => {
              if (data.type === 'start') {
                this.document.body.style.cursor = 'ew-resize';
              } else if (data.type === 'end') {
                this.document.body.style.cursor = '';
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

  handleDrag(event = { xx: 0, yy: 0 } as DragData, updateAuto = true) {
    const panels = this.resizable.panels();
    const isHorizontal = this.resizable.direction() === 'horizontal';

    const first = panels[this.index];
    const second = panels[this.index + 1];
    const x = isHorizontal ? event.xx : event.yy;

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
