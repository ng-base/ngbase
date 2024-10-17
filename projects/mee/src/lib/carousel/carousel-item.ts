import { Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeCarouselItem]',
  host: {
    class: 'flex-none',
  },
})
export class CarouselItem {
  el = inject<ElementRef<HTMLElement>>(ElementRef);

  get width() {
    return this.el.nativeElement.offsetWidth;
  }
}
