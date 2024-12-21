import { Component } from '@angular/core';
import { RangePipe } from '@meeui/adk/utils';
import { Card } from '@meeui/ui/card';
import { Skeleton } from '@meeui/ui/skeleton';

@Component({
  imports: [Skeleton, Card, RangePipe],
  selector: 'app-skeleton',
  template: ` <h4 meeHeader class="mb-5" id="colorPickerPage">Card</h4>

    <div class="grid grid-cols-4 gap-b4">
      @for (i of 3 | range; track $index) {
        <mee-card>
          <div class="flex flex-col gap-b2">
            <mee-skeleton [shape]="'circle'" class="h-b12 w-b12" />
            <div class="flex flex-col gap-b4">
              <div class="space-y-2">
                <mee-skeleton class="Text h-b4 w-20 font-bold" />
                <mee-skeleton class="h-b4 w-20 text-muted" />
              </div>
              <div class="space-y-4">
                <mee-skeleton class="h-b4" />
                <mee-skeleton class="h-b4" />
                <mee-skeleton class="h-b4" />
              </div>
              <div class="flex gap-b4">
                <mee-skeleton class="h-b2 flex-1" />
                <mee-skeleton class="h-b2 flex-1" />
              </div>
            </div>
          </div>
        </mee-card>
      }
    </div>`,
})
export default class SkeletonComponent {}
