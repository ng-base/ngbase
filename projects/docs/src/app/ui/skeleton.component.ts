import { Component } from '@angular/core';
import { RangePipe } from '@ngbase/adk/utils';
import { Card } from '@meeui/ui/card';
import { Skeleton } from '@meeui/ui/skeleton';

@Component({
  imports: [Skeleton, Card, RangePipe],
  selector: 'app-skeleton',
  template: ` <h4 meeHeader class="mb-5" id="colorPickerPage">Card</h4>

    <div class="grid grid-cols-4 gap-4">
      @for (i of 3 | range; track $index) {
        <mee-card>
          <div class="flex flex-col gap-2">
            <mee-skeleton [shape]="'circle'" class="h-12 w-12" />
            <div class="flex flex-col gap-4">
              <div class="space-y-2">
                <mee-skeleton class="Text h-4 w-20 font-bold" />
                <mee-skeleton class="h-4 w-20 text-muted" />
              </div>
              <div class="space-y-4">
                <mee-skeleton class="h-4" />
                <mee-skeleton class="h-4" />
                <mee-skeleton class="h-4" />
              </div>
              <div class="flex gap-4">
                <mee-skeleton class="h-2 flex-1" />
                <mee-skeleton class="h-2 flex-1" />
              </div>
            </div>
          </div>
        </mee-card>
      }
    </div>`,
})
export default class SkeletonComponent {}
