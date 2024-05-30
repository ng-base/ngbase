import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  effect,
  inject,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DragData, Drag } from '../drag';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ResizableGroup } from './resizable-group.component';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { Icons } from '../icon';

@Component({
  selector: 'mee-resizable',
  standalone: true,
  imports: [Drag, Icons],
  template: `<ng-content></ng-content>
    <ng-template #dragElement>
      <!-- @if (draggable()) { -->
      <div
        meeDrag
        class="dragElement relative flex cursor-ew-resize items-center justify-center border-border after:absolute after:top-0 after:h-full after:w-h"
        [class]="
          resizable.direction() === 'vertical'
            ? 'bottom-0 left-0 h-0 w-full cursor-ns-resize border-b'
            : 'right-0 top-0 w-0 cursor-ew-resize border-l'
        "
      >
        <mee-icon
          name="lucideGripVertical"
          class="rounded-base bg-background py-0.5"
        ></mee-icon>
      </div>
    </ng-template>`,
  host: {
    class: 'relative overflow-hidden block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGripVertical })],
})
export class Resizable implements OnDestroy {
  resizable = inject(ResizableGroup);
  drag = viewChild(Drag);
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  document = inject(DOCUMENT);
  size = model<number>(0);
  draggable = signal(false);
  index = 0;
  sub?: Subscription;
  containerRef = inject(ViewContainerRef);
  dragElement = viewChild('dragElement', { read: TemplateRef });

  constructor() {
    afterNextRender(() => {
      this.updateFlex(this.size());
      console.log('draggable', this.draggable());
    });

    effect(() => {
      if (this.draggable()) {
        untracked(() => {
          this.containerRef.createEmbeddedView(this.dragElement()!);
        });
      }
    });

    effect(() => {
      const drag = this.drag();
      this.sub?.unsubscribe();

      if (drag) {
        this.sub = drag.events.subscribe((data: DragData) => {
          if (data.type === 'start') {
            this.document.body.style.cursor = 'ew-resize';
          } else if (data.type === 'end') {
            this.document.body.style.cursor = '';
          }
          untracked(() => {
            this.onDrag(data);
          });
        });
      }
    });
  }

  get width() {
    return this.el.nativeElement.clientWidth;
  }

  get height() {
    return this.el.nativeElement.clientHeight;
  }

  onDrag(data: DragData) {
    data.event?.preventDefault();
    // this.resizableService.resize(data, this.index);
    requestAnimationFrame(() => {
      this.handleDrag(data, this.index);
    });
  }

  handleDrag(event: DragData, index: number) {
    const panels = this.resizable.panels();
    const direction = this.resizable.direction();

    const first = panels[index];
    const second = panels[index + 1];
    const totalPercentage = first.size() + second.size();
    let total = 0;
    let newSize = 0;
    if (direction === 'horizontal') {
      total = first.width + second.width;
      newSize = first.width + event.xx;
    } else {
      total = first.height + second.height;
      newSize = first.height + event.yy;
    }
    console.log(
      'first',
      first.size(),
      'second',
      second.size(),
      first.width,
      second.width,
      totalPercentage,
    );
    // find the percentage of the new size according to totalPercentage
    const percentage = (newSize / total) * totalPercentage;
    first.updateSize(percentage);
    second.updateSize(totalPercentage - percentage);
  }

  // update the size based on the pixel value
  // if it is positive, then reduce the size
  // if it is negative, then increase the size
  updateSize(percentage: number) {
    this.updateFlex(percentage);
    console.log('percentage', percentage);
    this.size.set(percentage);
  }

  updateFlex(percentage: number) {
    this.el.nativeElement.style.flex = `${percentage} 1 0px`;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
