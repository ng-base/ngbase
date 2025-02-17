import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  MeeCarousel,
  MeeCarouselButton,
  MeeCarouselContainer,
  MeeCarouselItem,
  MeeCarouselSubContainer,
  provideCarousel,
} from '@meeui/adk/carousel';

@Component({
  selector: 'mee-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCarousel(Carousel)],
  imports: [MeeCarouselContainer, MeeCarouselSubContainer],
  template: `
    <div class="touch-none overflow-hidden" meeCarouselContainer>
      <div meeCarouselSubContainer class="relative -ml-4 flex">
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
export class Carousel extends MeeCarousel {}

@Directive({
  selector: '[meeCarouselItem]',
  hostDirectives: [MeeCarouselItem],
})
export class CarouselItem {}

@Directive({
  selector: '[meeCarouselButton]',
  hostDirectives: [{ directive: MeeCarouselButton, inputs: ['meeCarouselButton'] }],
})
export class CarouselButton {}
