import { Component } from '@angular/core';
import { RangePipe } from '@meeui/adk/utils';
import { Card } from '@meeui/ui/card';
import { Carousel, CarouselButton, CarouselItem } from '@meeui/ui/carousel';

@Component({
  selector: 'app-root',
  imports: [Carousel, CarouselItem, CarouselButton, RangePipe, Card],
  template: `
    <mee-carousel #myCarousel>
      @for (item of 6 | range; track item) {
        <div meeCarouselItem class="aspect-square flex-[0_0_100%] pl-4 md:flex-[0_0_calc(100%/2)]">
          <mee-card class="grid h-full place-items-center" meeHeader="lg">
            {{ item }}
          </mee-card>
        </div>
      }
      <div class="flex justify-between">
        <button
          meeButton="outline"
          class="small"
          meeCarouselButton="prev"
          [disabled]="myCarousel.isFirst()"
        >
          <-
        </button>
        <div class="items center flex gap-1">
          @for (item of myCarousel.totalSteps() | range; track item) {
            <button
              class="aspect-square w-3 rounded-full bg-slate-300 hover:bg-slate-400"
              [class.bg-slate-500]="myCarousel.current() === item - 1"
              [meeCarouselButton]="item - 1"
            ></button>
          }
        </div>
        <button
          meeButton="outline"
          class="small"
          meeCarouselButton="next"
          [disabled]="myCarousel.isLast()"
        >
          ->
        </button>
      </div>
    </mee-carousel>
  `,
})
export class AppComponent {}
