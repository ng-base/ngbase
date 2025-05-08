import { computed, signal, Signal } from '@angular/core';

export class SelectionModel<T> {
  readonly selected = signal<T[]>([]);
  readonly hasValue = computed(() => this.selected().length > 0);
  readonly isEmpty = computed(() => this.selected().length === 0);
  readonly isAllSelected = computed(
    () => this.selected().length > 0 && this.selected().length === this.items().length,
  );
  readonly isIndeterminate = computed(() => this.selected().length > 0 && !this.isAllSelected());

  constructor(
    public multiple = false,
    selected: T[] = [],
    public items: Signal<T[]> = signal([]),
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

  toggleAll() {
    const isAll = this.isIndeterminate() || !this.isAllSelected();
    this.selected.update(x =>
      isAll ? (this.multiple ? [...x, ...this.items()] : this.items()) : [],
    );
  }

  sort(fn: (a: T, b: T) => number) {
    this.selected.update(selected => selected.sort(fn));
  }
}
