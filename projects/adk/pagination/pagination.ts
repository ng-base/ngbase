import { computed, Directive, inject, input, model, numberAttribute, output } from '@angular/core';

@Directive({
  selector: '[ngbPaginationBtn]',
  host: {
    type: 'button',
    '[attr.aria-label]': 'ariaLabel()',
    '[disabled]': 'disabled()',
    '(click)': 'clicked()',
    '[attr.aria-current]': 'ariaCurrent()',
  },
})
export class NgbPaginationBtn {
  readonly pagination = inject(NgbPagination);

  readonly ngbPaginationBtn = input.required<'next' | 'prev' | 'page'>();
  readonly jump = input(undefined, { transform: numberAttribute });

  readonly disabled = computed(() =>
    this.ngbPaginationBtn() === 'page'
      ? false
      : this.ngbPaginationBtn() === 'prev'
        ? !this.pagination.prev()
        : !this.pagination.next(),
  );
  readonly ariaLabel = computed(() => {
    return this.ngbPaginationBtn() === 'page'
      ? 'Go to page'
      : this.ngbPaginationBtn() === 'prev'
        ? 'Go to previous page'
        : 'Go to next page';
  });

  readonly ariaCurrent = computed(() =>
    this.ngbPaginationBtn() === 'page' && this.pagination.active() === this.jump()
      ? 'page'
      : undefined,
  );

  clicked() {
    if (this.ngbPaginationBtn() === 'page') {
      this.pagination.goto(this.jump()!);
    } else if (this.ngbPaginationBtn() === 'prev') {
      if (this.jump()) {
        this.pagination.jump(-1);
      } else {
        this.pagination.goto(0);
      }
    } else {
      if (this.jump()) {
        this.pagination.jump(1);
      } else {
        this.pagination.goto(this.pagination.total() - 1);
      }
    }
  }
}

@Directive({
  selector: '[ngbPagination]',
  host: {
    role: 'pagination',
    'aria-label': 'pagination',
  },
})
export class NgbPagination {
  // Inputs
  readonly size = model.required<number>();
  readonly active = model.required<number>();
  readonly total = input.required<number>();
  readonly sizeOptions = input<number[]>([10, 20, 50, 100]);

  readonly valueChanged = output<number>();

  // State
  readonly totalSnaps = computed(() => Math.ceil(this.total() / this.size()));
  readonly snaps = computed(() => {
    const activeIndex = this.active();
    const total = this.totalSnaps();

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
  readonly next = computed(() => this.active() < this.totalSnaps());

  goto(index: number) {
    const total = this.totalSnaps();
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

export function aliasPagination(pagination: typeof NgbPagination) {
  return { provide: NgbPagination, useExisting: pagination };
}
