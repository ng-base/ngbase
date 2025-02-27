import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  NgbCarousel,
  NgbCarouselButton,
  NgbCarouselContainer,
  NgbCarouselItem,
  NgbCarouselSubContainer,
  aliasCarousel,
} from '@ngbase/adk/carousel';

@Component({
  selector: 'mee-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasCarousel(Carousel)],
  imports: [NgbCarouselContainer, NgbCarouselSubContainer],
  template: `
    <div class="touch-none overflow-hidden" ngbCarouselContainer>
      <div ngbCarouselSubContainer class="relative -ml-4 flex">
        <ng-content select="[meeCarouselItem]" />
      </div>
    </div>
    <div>
      <ng-content />
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 relative',
  },
})
export class Carousel extends NgbCarousel {}

@Directive({
  selector: '[meeCarouselItem]',
  hostDirectives: [NgbCarouselItem],
})
export class CarouselItem {}

@Directive({
  selector: '[meeCarouselButton]',
  hostDirectives: [
    { directive: NgbCarouselButton, inputs: ['ngbCarouselButton: meeCarouselButton'] },
  ],
})
export class CarouselButton {}
