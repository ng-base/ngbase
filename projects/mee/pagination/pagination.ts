import { Component } from '@angular/core';
import { MeePagination, MeePaginationBtn } from '@meeui/adk/pagination';
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
  providers: [{ provide: MeePagination, useExisting: Pagination }],
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  imports: [Button, Icon, Select, Option, MeePaginationBtn],
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
    <div>Page {{ active() }} of {{ _totalSize() }}</div>
    <div class="flex items-center gap-b2">
      <button meePaginationBtn="prev" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronsLeft" />
      </button>
      <button meePaginationBtn="prev" jump="-1" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronLeft" />
      </button>
      @if (showPage()) {
        @for (item of items(); track item) {
          <button
            meePaginationBtn="page"
            [jump]="item"
            meeButton="ghost"
            class="min-w-b9 !p-b2 ring-offset-background aria-[current=page]:bg-muted-background aria-[current=page]:text-primary"
          >
            {{ item }}
          </button>
        }
      }
      <button meePaginationBtn="next" jump="1" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronRight" />
      </button>
      <button meePaginationBtn="next" meeButton="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronsRight" />
      </button>
    </div>
  `,
  host: {
    class: 'flex items-center gap-b8 font-semibold',
  },
})
export class Pagination extends MeePagination {}
