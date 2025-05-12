import {
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { NgbTable } from './table';
import { NgbColumn } from './column';

export type SortDirection = 'asc' | 'desc' | '';

export interface Sort {
  active: string;
  direction: SortDirection;
}

export type SortFn<T> = (data: T[], column: string, direction: SortDirection) => T[];

@Directive({
  selector: '[ngbSort]',
})
export class NgbSort<T> {
  private readonly table = inject(NgbTable);

  readonly sortFn = input<SortFn<T>>();
  readonly disableClear = input<boolean>(false);

  readonly sortColumn = model<string>('');
  readonly sortDirection = model<SortDirection>('');
  readonly sortMode = input<'client' | 'server'>('client');
  readonly sortChange = output<Sort>();

  constructor() {
    effect(cleanup => {
      if (this.sortMode() === 'client') {
        const sortFn = untracked(() => this.sortFn() || this.defaultSortFn);
        const fn = (data: T[]) => sortFn(data, this.sortColumn(), this.sortDirection());
        this.table.plugins.update(plugins => new Set([...plugins, fn]));
        cleanup(() => {
          this.table.plugins.update(
            plugins => new Set([...plugins].filter(plugin => plugin !== fn)),
          );
        });
      }
    });
  }

  private defaultSortFn: SortFn<T> = (data: T[], column: string, direction: SortDirection) => {
    let sorted = [...data];
    if (direction && column) {
      sorted = sorted.sort((a, b) => {
        const aValue = a[column as keyof T];
        const bValue = b[column as keyof T];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  };

  sort(column: string, direction?: SortDirection) {
    let currentDirection = this.sortDirection();
    const currentColumn = this.sortColumn();

    let newDirection: SortDirection;
    let newColumn: string;

    if (direction !== undefined) {
      newDirection = direction;
      newColumn = column;
    } else if (currentColumn === column) {
      if (currentDirection === 'asc') {
        newDirection = 'desc';
        newColumn = column;
      } else if (currentDirection === 'desc') {
        if (this.disableClear()) {
          newDirection = 'asc';
          newColumn = column;
        } else {
          newDirection = '';
          newColumn = '';
        }
      } else {
        newDirection = 'asc';
        newColumn = column;
      }
    } else {
      newDirection = 'asc';
      newColumn = column;
    }

    this.sortColumn.set(newColumn);
    this.sortDirection.set(newDirection);

    this.sortChange.emit({
      active: newColumn,
      direction: newDirection,
    });
  }
}

@Directive({
  selector: '[ngbSortHeader]',
  host: {
    '[attr.aria-sort]': 'sortDirection()',
  },
})
export class NgbSortHeader<T extends NgbSort<U>, U = any> {
  readonly sort = inject<T>(NgbSort as any);
  readonly column = inject(NgbColumn);

  readonly disableClear = input<boolean>(false);
  readonly sortDirection = computed(() => {
    return this.column.ngbColumn() === this.sort.sortColumn()
      ? this.sort.sortDirection()
      : undefined;
  });

  setDirections(direction: SortDirection) {
    this.sort.sort(this.column.ngbColumn(), direction);
  }

  toggle() {
    this.sort.sort(
      this.column.ngbColumn(),
      this.sortDirection() === 'asc' ? 'desc' : this.sortDirection() === 'desc' ? '' : 'asc',
    );
  }
}

export function aliasSort(directive: typeof NgbSort) {
  return { provide: NgbSort, useExisting: directive };
}

export function aliasSortHeader(directive: typeof NgbSortHeader<any, any>) {
  return { provide: NgbSortHeader, useExisting: directive };
}
