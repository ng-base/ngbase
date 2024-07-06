import { Component, computed, input, model, output, signal } from '@angular/core';
import { Button } from '../button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { Icons } from '../icon';

@Component({
  selector: 'mee-pagination',
  standalone: true,
  imports: [Button, Icons],
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  template: `
    <!-- @if (active() === 1) { -->
    <button
      meeButton
      variant="ghost"
      [disabled]="active() === 1"
      (click)="goto(0)"
      class="min-w-b9 !p-b2"
    >
      <mee-icon name="lucideChevronsLeft"></mee-icon>
    </button>
    <!-- } -->
    <button
      meeButton
      variant="ghost"
      (click)="jump(-1)"
      [disabled]="active() === 1"
      aria-label="Go to previous page"
      class="min-w-b9 !p-b2"
    >
      <mee-icon name="lucideChevronLeft"></mee-icon>
    </button>
    @for (item of items(); track item) {
      <button
        meeButton
        variant="ghost"
        [class]="active() === item ? 'bg-background text-primary' : ''"
        (click)="goto(item)"
        class="min-w-b9 !p-b2 ring-offset-background"
        aria-current="page"
      >
        {{ item }}
      </button>
    }
    <button
      meeButton
      variant="ghost"
      (click)="jump(1)"
      [disabled]="active() === _totalSize()"
      aria-label="Go to next page"
      class="min-w-b9 !p-b2"
    >
      <mee-icon name="lucideChevronRight"></mee-icon>
    </button>
    <!-- @if (next()) { -->
    <button
      meeButton
      variant="ghost"
      [disabled]="active() === _totalSize()"
      (click)="jump(5)"
      class="min-w-b9 !p-b2"
    >
      <mee-icon name="lucideChevronsRight"></mee-icon>
    </button>
    <!-- } -->
  `,
  host: {
    class: 'flex gap-1',
    role: 'pagination',
    'aria-label': 'pagination',
  },
})
export class Pagination {
  readonly total = input.required<number>();
  readonly size = input.required<number>();
  readonly active = model.required<number>();
  readonly valueChanged = output<number>();
  readonly _totalSize = computed(() => {
    return Math.ceil(this.total() / this.size());
  });
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

  readonly prev = computed(() => {
    const items = this.items();
    return items[0] > 1;
  });

  readonly next = computed(() => {
    const items = this.items();
    const total = this._totalSize();
    return items[items.length - 1] < total;
  });

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
}
