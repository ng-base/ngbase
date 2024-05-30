import { Directive, ElementRef, inject } from '@angular/core';
import { Drag } from './drag.directive';

@Directive({
  standalone: true,
  selector: '[meeDragMove]',
  hostDirectives: [Drag],
})
export class DragMove {
  drag = inject(Drag);
  el = inject(ElementRef);

  constructor() {
    let x = 0;
    let y = 0;
    this.drag.events.subscribe((data) => {
      if (data.type === 'start') {
        const rect = this.el.nativeElement.getBoundingClientRect();
        x = data.clientX! - rect.left;
        y = data.clientY! - rect.top;
      } else if (data.type === 'move') {
        this.el.nativeElement.style.transform = `translate(${data.clientX! - x}px, ${data.clientY! - y}px)`;
      }
    });
  }
}
