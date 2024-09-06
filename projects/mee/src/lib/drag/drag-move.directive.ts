import { Directive, ElementRef, inject, input } from '@angular/core';
import { Drag } from './drag.directive';

@Directive({
  standalone: true,
  selector: '[meeDragMove]',
  hostDirectives: [Drag],
})
export class DragMove {
  private drag = inject(Drag);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly target = input<HTMLElement>();
  private scale = 1;
  x = 0;
  y = 0;

  constructor() {
    this.drag.events.subscribe(data => {
      data.event?.preventDefault();
      requestAnimationFrame(() => {
        if (data.type === 'move') {
          this.x += data.dx;
          this.y += data.dy;
          this.updateTransform();
        }
      });
    });

    this.el.nativeElement.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = this.element.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prevScale = this.scale;
      this.scale = Math.max(0.1, Math.min(10, this.scale + e.deltaY * -0.001));

      const scaleRatio = this.scale / prevScale;

      this.x += ((mouseX - this.x) * (1 - scaleRatio)) / this.scale;
      this.y += ((mouseY - this.y) * (1 - scaleRatio)) / this.scale;

      this.updateTransform();
    });
  }

  private get element() {
    return this.target() ?? this.el.nativeElement;
  }

  private updateTransform() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }
}
