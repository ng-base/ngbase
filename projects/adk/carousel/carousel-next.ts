import { Directive, inject, input } from '@angular/core';
import { MeeCarousel } from './carousel';

@Directive({
  selector: '[meeCarouselButton]',
  host: {
    '(click)': 'clicked($event)',
  },
})
export class MeeCarouselButton {
  private readonly carousel = inject(MeeCarousel);

  readonly meeCarouselButton = input.required<number | 'next' | 'prev'>();

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
