import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[meeCarouselItem]',
})
export class MeeCarouselItem {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  get width() {
    const width = this.el.nativeElement.getBoundingClientRect().width;
    return width;
  }
}
