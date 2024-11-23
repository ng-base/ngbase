import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Carousel, CarouselButton, CarouselItem } from '@meeui/ui/carousel';
import { Heading } from '@meeui/ui/typography';
import { RangePipe } from '@meeui/adk/utils';
import { DocCode } from './code.component';

@Component({
  selector: 'app-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Carousel, CarouselItem, CarouselButton, RangePipe, Card, Heading, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Carousel</h4>

    <app-doc-code [tsCode]="tsCode">
      <mee-carousel #myCarousel class="w-72">
        @for (item of 6 | range; track item) {
          <div meeCarouselItem class="aspect-square h-72" [class]="!$last ? 'pr-4' : ''">
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
    </app-doc-code>
  `,
})
export class CarouselComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Carousel, CarouselButton, CarouselItem } from '@meeui/ui/carousel';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`
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
          <div class="flex items center gap-1">
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
    \`,
    imports: [Carousel, CarouselItem, CarouselButton],
  })
  export class AppComponent { }
  `;
}
