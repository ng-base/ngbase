import { Component, OnInit, inject } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { TourService } from '@meeui/ui/tour';
import { RangePipe } from '@meeui/ui/utils';

@Component({
  selector: 'app-tour-demo',
  imports: [Button, RangePipe],
  template: `
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda quibusdam
      maiores dignissimos harum suscipit accusantium ab illo inventore possimus.
    </p>
    <div class="flex justify-between gap-4">
      <button meeButton variant="ghost" (click)="tourService.stop()">Skip</button>
      <div class="inline-flex justify-between gap-4">
        @if (tourService.showPrev()) {
          <button meeButton variant="ghost" (click)="tourService.prev()"><-</button>
        }
        <div class="inline-flex items-center gap-0.5">
          @for (item of tourService.totalSteps() | range; track item) {
            <div
              class="aspect-square w-3 rounded-full bg-background"
              [class.bg-primary]="tourService.step() + 1 === item"
            ></div>
          }
        </div>
        <button meeButton variant="ghost" (click)="tourService.next()">
          @if (tourService.showNext()) {
            ->
          } @else {
            Complete
          }
        </button>
      </div>
    </div>
  `,
  host: {
    class: 'block p-2',
  },
})
export class TourDemoComponent implements OnInit {
  tourService = inject(TourService);

  constructor() {}

  ngOnInit() {}
}
