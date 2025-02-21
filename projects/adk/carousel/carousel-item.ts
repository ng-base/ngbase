import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[meeCarouselItem]',
})
export class MeeCarouselItem {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  get width() {
    const el = this.el.nativeElement;
    return el.getBoundingClientRect?.().width ?? el.offsetWidth; // SSR: fallback to offsetWidth
  }
}
