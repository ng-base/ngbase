import { Component, computed, input, model, output } from '@angular/core';
import { Button } from '../button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { Icon } from '../icon';
import { Option, Select } from '../select';

@Component({
  standalone: true,
  selector: 'mee-pagination',
  imports: [Button, Icon, Select, Option],
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
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
      <button
        type="button"
        meeButton
        variant="outline"
        [disabled]="!prev()"
        (click)="goto(0)"
        class="h-b8 w-b8 !p-b2"
      >
        <mee-icon name="lucideChevronsLeft" />
      </button>
      <button
        type="button"
        meeButton
        variant="outline"
        (click)="jump(-1)"
        [disabled]="!prev()"
        aria-label="Go to previous page"
        class="h-b8 w-b8 !p-b2"
      >
        <mee-icon name="lucideChevronLeft" />
      </button>
      @if (showPage()) {
        @for (item of items(); track item) {
          <button
            type="button"
            meeButton
            variant="ghost"
            [class]="active() === item ? 'bg-muted-background text-primary' : ''"
            (click)="goto(item)"
            class="min-w-b9 !p-b2 ring-offset-background"
            aria-current="page"
          >
            {{ item }}
          </button>
        }
      }
      <button
        type="button"
        meeButton
        variant="outline"
        (click)="jump(1)"
        [disabled]="!next()"
        aria-label="Go to next page"
        class="h-b8 w-b8 !p-b2"
      >
        <mee-icon name="lucideChevronRight" />
      </button>
      <button
        type="button"
        meeButton
        variant="outline"
        [disabled]="!next()"
        (click)="jump(total() - 1)"
        class="h-b8 w-b8 !p-b2"
      >
        <mee-icon name="lucideChevronsRight" />
      </button>
    </div>
  `,
  host: {
    class: 'flex items-center gap-b8 font-semibold',
    role: 'pagination',
    'aria-label': 'pagination',
  },
})
export class Pagination {
  readonly total = input.required<number>();
  readonly size = model.required<number>();
  readonly sizeOptions = input<number[]>([10, 20, 50, 100]);
  readonly active = model.required<number>();
  readonly valueChanged = output<number>();
  readonly showPage = input<boolean>(false);
  readonly _totalSize = computed(() => Math.ceil(this.total() / this.size()));
  readonly items = computed(() => {
    const activeIndex = this.active();
    const total = this._totalSize();

    const num = [];
    let start = activeIndex - 2 > 1 ? activeIndex - 2 : 1;
    let end = start + 4;

    if (end > total) {
      end = total;
      start = total - 4 > 1 ? total - 4 : 1;
    }

    for (let i = start; i <= end; i++) {
      num.push(i);
    }
    return num;
  });

  readonly prev = computed(() => this.active() > 1);
  readonly next = computed(() => this.active() < this._totalSize());

  goto(index: number) {
    const total = this._totalSize();
    this.active.update(e => {
      e = index <= total ? index : total;
      e = e >= 1 ? e : 1;
      return e;
    });
    this.valueChanged.emit(this.active());
  }

  jump(by: number) {
    const active = this.active();
    this.goto(active + by);
  }

  sizeChanged(size: number) {
    this.size.set(size);
    this.active.set(1);
    this.valueChanged.emit(this.active());
  }
}
