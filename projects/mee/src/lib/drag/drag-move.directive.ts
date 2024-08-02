import { Directive, ElementRef, inject, input } from '@angular/core';
import { Drag } from './drag.directive';

@Directive({
  standalone: true,
  selector: '[meeDragMove]',
  hostDirectives: [Drag],
})
export class DragMove {
  private drag = inject(Drag);
  private el = inject(ElementRef);
  readonly target = input<HTMLElement>();

  constructor() {
    let x = 0;
    let y = 0;
    this.drag.events.subscribe(data => {
      data.event?.preventDefault();
      requestAnimationFrame(() => {
        // if (data.type === 'start') {
        // const rect = this.element.getBoundingClientRect();
        // x = data.clientX! - rect.left;
        // y = data.clientY! - rect.top;
        // console.log('start', x, y, rect, data);
        // } else
        if (data.type === 'move') {
          // this.element.style.transform = `translate(${data.clientX! - x}px, ${data.clientY! - y}px)`;
          x += data.xx;
          y += data.yy;
          this.element.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    });
  }

  private get element() {
    return this.target() ?? this.el.nativeElement;
  }
}
