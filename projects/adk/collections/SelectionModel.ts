import { computed, signal } from '@angular/core';

export class SelectionModel<T> {
  readonly selected = signal<T[]>([]);
  readonly hasValue = computed(() => this.selected().length > 0);
  readonly isEmpty = computed(() => this.selected().length === 0);

  constructor(
    public multiple = false,
    selected: T[] = [],
  ) {
    this.selected.set(selected);
  }

  clear() {
    this.selected.set([]);
  }

  select(item: T) {
    this.selected.update(selected => (this.multiple ? [...selected, item] : [item]));
  }

  deselect(item: T) {
    this.selected.update(selected => (this.multiple ? selected.filter(i => i !== item) : []));
  }

  selectAll(items: T[]) {
    this.selected.update(selected => (this.multiple ? [...selected, ...items] : items));
  }

  isSelected(item: T) {
    return this.selected().includes(item);
  }

  toggle(item: T) {
    this.selected.update(selected =>
      selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item],
    );
  }

  sort(fn: (a: T, b: T) => number) {
    this.selected.update(selected => selected.sort(fn));
  }
}
