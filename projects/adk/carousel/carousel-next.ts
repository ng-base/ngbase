import { Directive, inject, input } from '@angular/core';
import { NgbCarousel } from './carousel';

@Directive({
  selector: '[ngbCarouselButton]',
  host: {
    '(click)': 'clicked($event)',
  },
})
export class NgbCarouselButton {
  private readonly carousel = inject(NgbCarousel);

  readonly ngbCarouselButton = input.required<number | 'next' | 'prev'>();

  clicked(event: Event) {
    event.preventDefault();
    const no = this.ngbCarouselButton();
    if (no === 'next') {
      this.carousel.next();
    } else if (no === 'prev') {
      this.carousel.prev();
    } else {
      this.carousel.go(no);
    }
  }
}
