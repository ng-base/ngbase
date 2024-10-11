import { computed, signal } from '@angular/core';

export function generateId() {
  return Math.random().toString(36).substring(7);
}

export function filterFunction<T, V = T>(
  data: T[],
  options: {
    filter?: (v: V) => string;
    childrenFilter?: (v: T) => V[];
    query?: (v: V, search: string) => boolean;
  },
) {
  const search = signal('');
  const list = signal(data || []);

  const filteredList = computed(() => {
    const text = search().toLowerCase();
    const lists = list();

    console.log(text, options);
    const query =
      options.query ?? ((v: V, t: string) => options.filter!(v).toLowerCase().includes(t));
    return lists.reduce((acc, item) => {
      if (options.childrenFilter) {
        const children = options.childrenFilter(item);
        const filteredChildren = children.filter(child => query(child as unknown as V, text));
        if (filteredChildren.length) {
          acc.push({ ...item, children: filteredChildren });
        }
      } else if (query(item as unknown as V, text)) {
        acc.push(item);
      }
      return acc;
    }, [] as T[]);
  });
  return { search, list, filteredList };
}
