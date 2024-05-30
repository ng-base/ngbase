import { Component, computed, input, model, signal } from '@angular/core';
import { Button } from '../button';

@Component({
  selector: 'mee-pagination',
  standalone: true,
  imports: [Button],
  template: `
    <button
      meeButton
      variant="ghost"
      (click)="jump(-1)"
      [disabled]="active() === 1"
      aria-label="Go to previous page"
    >
      Previous
    </button>
    @if (prev()) {
      <button meeButton variant="ghost" (click)="jump(-5)"><<</button>
    }
    @for (item of items(); track item) {
      <button
        meeButton
        variant="ghost"
        [class]="active() === item ? 'bg-background text-primary' : ''"
        (click)="goto(item)"
        class="ring-offset-background"
        aria-current="page"
      >
        {{ item }}
      </button>
    }
    @if (next()) {
      <button meeButton variant="ghost" (click)="jump(5)">>></button>
    }
    <button
      meeButton
      variant="ghost"
      (click)="jump(1)"
      [disabled]="active() === _totalSize()"
      aria-label="Go to next page"
    >
      Next
    </button>
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
    this.active.update((e) => {
      e = index <= total ? index : total;
      e = e >= 1 ? e : 1;
      return e;
    });
  }

  jump(by: number) {
    const active = this.active();
    this.goto(active + by);
  }
}
