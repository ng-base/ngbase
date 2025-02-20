import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RangePipe } from '@meeui/adk/utils';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Carousel, CarouselButton, CarouselItem } from '@meeui/ui/carousel';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-carousel-snaps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselButton, Button, RangePipe],
  template: `
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
  `,
  host: {
    class: 'flex justify-between',
  },
})
export class CarouselSnaps {
  readonly myCarousel = inject(Carousel);
}

@Component({
  selector: 'app-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card],
  template: `
    <mee-card class="grid h-full place-items-center text-4xl font-semibold">
      {{ item() }}
    </mee-card>
  `,
  host: {
    class: 'h-48 flex-[0_0_100%] pl-4',
  },
})
export class CarouselCardItem {
  readonly item = input.required<number>();
}

@Component({
  selector: 'app-carousel-origin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Carousel, CarouselItem, CarouselSnaps, CarouselCardItem, Heading, RangePipe],
  template: `
    <h1 class="mb-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Carousel</h1>
    <h4 meeHeader="xs" class="mb-5">Default carousel</h4>
    <mee-carousel #myCarousel class="mx-auto max-w-[48rem]">
      @for (item of 5 | range; track item) {
        <app-carousel-item meeCarouselItem [item]="item" />
      }
      <app-carousel-snaps />
    </mee-carousel>

    <h4 meeHeader="xs" class="my-10 mb-5">Slides to scroll</h4>
    <mee-carousel #myCarousel class="mx-auto max-w-[48rem]">
      @for (item of 10 | range; track item) {
        <app-carousel-item meeCarouselItem class="flex-[0_0_calc(100%/2)]" [item]="item" />
      }
      <app-carousel-snaps />
    </mee-carousel>

    <h4 meeHeader="xs" class="my-10 mb-5">Align</h4>
    <mee-carousel #myCarousel class="mx-auto max-w-[48rem]">
      @for (item of 10 | range; track item) {
        <app-carousel-item meeCarouselItem class="flex-[0_0_70%]" [item]="item" />
      }
      <app-carousel-snaps />
    </mee-carousel>
  `,
})
export default class CarouselOrigin {}
