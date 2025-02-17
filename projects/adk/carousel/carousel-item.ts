import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[meeCarouselItem]',
})
export class MeeCarouselItem {
  el = inject<ElementRef<HTMLElement>>(ElementRef);

  get width() {
    const width = this.el.nativeElement.getBoundingClientRect().width;
    return width;
  }
}
