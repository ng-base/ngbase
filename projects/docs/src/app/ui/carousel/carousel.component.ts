import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Carousel, CarouselButton, CarouselItem } from '@meeui/ui/carousel';
import { Heading } from '@meeui/ui/typography';
import { RangePipe } from '@meeui/adk/utils';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Carousel, CarouselItem, CarouselButton, RangePipe, Card, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Carousel</h4>

    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()" [referencesCode]="referenceCode()">
      <mee-carousel #myCarousel class="w-72 md:w-[400px]">
        @for (item of 11 | range; track item) {
          <div
            meeCarouselItem
            class="aspect-square min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
          >
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
          <div class="flex items-center gap-1">
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
    </app-doc-code>
  `,
})
export default class CarouselComponent {
  tsCode = getCode('/carousel/carousel-usage.ts');

  adkCode = getCode('/carousel/carousel-adk.ts');

  referenceCode = getCode('/carousel/carousel-reference.ts');
}
