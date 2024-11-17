import { Directive, inject, input } from '@angular/core';
import { Carousel } from './carousel';

@Directive({
  selector: '[meeCarouselButton]',
  host: {
    '(click)': 'clicked()',
  },
})
export class CarouselButton {
  meeCarouselButton = input.required<number>();
  carousel = inject(Carousel);

  clicked() {
    this.carousel.next(this.meeCarouselButton());
  }
}
