import { Directive, inject, input } from '@angular/core';
import { MeeCarousel } from './carousel';

@Directive({
  selector: '[meeCarouselButton]',
  host: {
    '(click)': 'clicked($event)',
  },
})
export class MeeCarouselButton {
  meeCarouselButton = input.required<number | 'next' | 'prev'>();
  carousel = inject(MeeCarousel);

  clicked(event: Event) {
    event.preventDefault();
    const no = this.meeCarouselButton();
    if (no === 'next') {
      this.carousel.next();
    } else if (no === 'prev') {
      this.carousel.prev();
    } else {
      this.carousel.go(no);
    }
  }
}
