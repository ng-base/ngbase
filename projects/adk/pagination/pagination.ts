import {
  Component,
  computed,
  Directive,
  inject,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';
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

@Directive({
  selector: '[meePaginationBtn]',
  host: {
    type: 'button',
    '[attr.aria-label]': 'ariaLabel()',
    '[disabled]': 'disabled()',
    '(click)': 'clicked()',
    '[attr.aria-current]': 'ariaCurrent()',
  },
})
export class MeePaginationBtn {
  readonly pagination = inject(MeePagination);

  readonly meePaginationBtn = input.required<'next' | 'prev' | 'page'>();
  readonly jump = input(undefined, { transform: numberAttribute });

  readonly disabled = computed(() =>
    this.meePaginationBtn() === 'page'
      ? false
      : this.meePaginationBtn() === 'prev'
        ? !this.pagination.prev()
        : !this.pagination.next(),
  );
  readonly ariaLabel = computed(() => {
    return this.meePaginationBtn() === 'page'
      ? 'Go to page'
      : this.meePaginationBtn() === 'prev'
        ? 'Go to previous page'
        : 'Go to next page';
  });

  readonly ariaCurrent = computed(() =>
    this.meePaginationBtn() === 'page' && this.pagination.active() === this.jump()
      ? 'page'
      : undefined,
  );

  clicked() {
    if (this.meePaginationBtn() === 'page') {
      this.pagination.goto(this.jump()!);
    } else if (this.meePaginationBtn() === 'prev') {
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

@Component({
  selector: '[meePagination]',
  imports: [Button, Icon, Select, Option, MeePaginationBtn],
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
      <button meePaginationBtn="prev" meeButton variant="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronsLeft" />
      </button>
      <button meePaginationBtn="prev" jump="-1" meeButton variant="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronLeft" />
      </button>
      @if (showPage()) {
        @for (item of items(); track item) {
          <button
            meePaginationBtn="page"
            [jump]="item"
            meeButton
            variant="ghost"
            [class]="active() === item ? 'bg-muted-background text-primary' : ''"
            class="min-w-b9 !p-b2 ring-offset-background"
          >
            {{ item }}
          </button>
        }
      }
      <button meePaginationBtn="next" jump="1" meeButton variant="outline" class="h-b8 w-b8 !p-b2">
        <mee-icon name="lucideChevronRight" />
      </button>
      <button meePaginationBtn="next" meeButton variant="outline" class="h-b8 w-b8 !p-b2">
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
export class MeePagination {
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
