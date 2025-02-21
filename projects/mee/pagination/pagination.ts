import { Component, input } from '@angular/core';
import { NgbPagination, NgbPaginationBtn } from '@ngbase/adk/pagination';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { Option, Select } from '@meeui/ui/select';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';

@Component({
  selector: 'mee-pagination',
  providers: [{ provide: NgbPagination, useExisting: Pagination }],
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  imports: [Button, Icon, Select, Option, NgbPaginationBtn],
  template: `
    <div class="flex items-center gap-b2">
      <div>Rows per page</div>
      <mee-select [value]="size()" (valueChange)="sizeChanged($event)" class="w-20 !py-b1.5">
        @for (size of sizeOptions(); track size) {
          <mee-option [value]="size">
            {{ size }}
          </mee-option>
        }
      </mee-select>
    </div>
    <div>Page {{ active() }} of {{ totalSnaps() }}</div>
    <div class="flex items-center gap-b2">
      <button ngbPaginationBtn="prev" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronsLeft" />
      </button>
      <button ngbPaginationBtn="prev" jump="-1" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronLeft" />
      </button>
      @if (showPage()) {
        @for (snap of snaps(); track snap) {
          <button
            ngbPaginationBtn="page"
            [jump]="snap"
            meeButton="ghost"
            class="min-w-b9 !p-b2 ring-offset-background aria-[current=page]:bg-muted-background aria-[current=page]:text-primary"
          >
            {{ snap }}
          </button>
        }
      }
      <button ngbPaginationBtn="next" jump="1" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronRight" />
      </button>
      <button ngbPaginationBtn="next" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronsRight" />
      </button>
    </div>
  `,
  host: {
    class: 'flex items-center gap-b8 font-semibold',
  },
})
export class Pagination extends NgbPagination {
  readonly showPage = input<boolean>(false);
}
