import { Directive, ElementRef, inject, input } from '@angular/core';
import { Drag } from './drag';

@Directive({
  standalone: true,
  selector: '[meeDragMove]',
  hostDirectives: [
    {
      directive: Drag,
      inputs: ['dragBoundary'],
    },
  ],
})
export class DragMove {
  private drag = inject(Drag);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly target = input<HTMLElement>();
  private scale = 1;
  private x = 0;
  private y = 0;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    this.drag.events.subscribe(data => {
      data.event?.preventDefault();
      requestAnimationFrame(() => {
        if (data.type === 'move') {
          this.x = data.x + this.lastX;
          this.y = data.y + this.lastY;
          this.updateTransform();
        } else if (data.type === 'end') {
          this.lastX = this.x;
          this.lastY = this.y;
        }
      });
    });

    // this.el.nativeElement.addEventListener('wheel', e => {
    //   e.preventDefault();
    //   const rect = this.element.getBoundingClientRect();
    //   const mouseX = e.clientX - rect.left;
    //   const mouseY = e.clientY - rect.top;

    //   const prevScale = this.scale;
    //   this.scale = Math.max(0.1, Math.min(10, this.scale + e.deltaY * -0.001));

    //   const scaleRatio = this.scale / prevScale;

    //   this.x += ((mouseX - this.x) * (1 - scaleRatio)) / this.scale;
    //   this.y += ((mouseY - this.y) * (1 - scaleRatio)) / this.scale;

    //   this.updateTransform();
    // });
  }

  private get element() {
    return this.target() ?? this.el.nativeElement;
  }

  private updateTransform() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }
}
