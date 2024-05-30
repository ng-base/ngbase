import { Directive, inject, input } from '@angular/core';
import { Carousel } from './carousel.component';

@Directive({
  standalone: true,
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
