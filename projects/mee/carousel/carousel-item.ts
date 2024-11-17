import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
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
