import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ResizableService } from './resizable.service';
import { DragData, DragDirective } from '../drag';

@Component({
  selector: 'mee-resizable',
  standalone: true,
  imports: [DragDirective],
  template: `<ng-content></ng-content>
    @if (draggable()) {
      <div
        (meeDrag)="drag($event)"
        class="absolute cursor-ew-resize border-border"
        [class]="
          resizableService.direction() === 'vertical'
            ? 'bottom-0 left-0 h-0 w-full cursor-ns-resize border-b'
            : 'right-0 top-0 h-full w-0 cursor-ew-resize border-l'
        "
      ></div>
    } `,
  host: {
    class: 'relative overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resizable {
  resizableService = inject(ResizableService);
  dragEl = viewChild(DragDirective);
  el = inject(ElementRef);
  size = model<number>(0);
  draggable = signal(false);
  index = 0;

  constructor() {
    afterNextRender(() => {
      this.updateFlex(this.size());
    });
  }

  get width() {
    return this.el.nativeElement.getBoundingClientRect().width;
  }

  get height() {
    return this.el.nativeElement.getBoundingClientRect().height;
  }

  drag(data: DragData) {
    data.event?.preventDefault();
    this.resizableService.resize(data, this.index);
  }

  // update the size based on the pixel value
  // if it is positive, then reduce the size
  // if it is negative, then increase the size
  updateSize(percentage: number) {
    this.size.set(percentage);
    this.updateFlex(percentage);
  }

  updateFlex(percentage: number) {
    this.el.nativeElement.style.flex = `${percentage} 1 0px`;
  }
}
