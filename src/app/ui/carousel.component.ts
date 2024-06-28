import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Carousel, CarouselButton, CarouselItem } from '@meeui/carousel';
import { RangePipe } from '@meeui/utils';
import { Card } from '@meeui/card';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Carousel, CarouselItem, CarouselButton, RangePipe, Card, Heading, Button],
  template: `
    <h4 meeHeader class="mb-5">Carousel</h4>
    <mee-carousel #myCarousel>
      @for (item of 6 | range; track item) {
        <div meeCarouselItem class="h-56 w-[80%]" [class.pr-4]="!$last">
          <mee-card class="grid h-full place-items-center" meeHeader="lg">
            {{ item }}
          </mee-card>
        </div>
      }
      <div class="flex justify-between">
        <button
          meeButton
          variant="outline"
          class="small"
          [meeCarouselButton]="-1"
          [disabled]="myCarousel.isFirst()"
        >
          <-
        </button>
        <div class="flex items-center gap-1">
          @for (item of myCarousel.totalSteps() | range; track item) {
            <button
              class="aspect-square w-3 rounded-full bg-slate-300 hover:bg-slate-400"
              [class.bg-slate-500]="myCarousel.current() === item - 1"
              (click)="myCarousel.go(item - 1)"
            ></button>
          }
        </div>
        <button
          meeButton
          variant="outline"
          class="small"
          [meeCarouselButton]="1"
          [disabled]="myCarousel.isLast()"
        >
          ->
        </button>
      </div>
    </mee-carousel>
  `,
})
export class CarouselComponent {}
