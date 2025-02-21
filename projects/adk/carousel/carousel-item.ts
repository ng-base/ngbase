import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ngbCarouselItem]',
})
export class NgbCarouselItem {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  get width() {
    const el = this.el.nativeElement;
    return el.getBoundingClientRect?.().width ?? el.offsetWidth; // SSR: fallback to offsetWidth
  }
}
