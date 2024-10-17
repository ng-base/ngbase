import {
  computed,
  DestroyRef,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
export function generateId() {
  return Math.random().toString(36).substring(7);
}

export function cleanup(fn: () => void) {
  inject(DestroyRef).onDestroy(fn);
}

export function documentListener<T extends Event>(
  ev: string,
  fn: (e: T) => void,
  data: Partial<AddEventListenerOptions & { injector?: Injector; lazy?: boolean }> = {},
) {
  const { injector = inject(Injector), lazy = false, ...listenerOptions } = data;
  let active = false;
  const controller = { on: () => {}, off: () => {} };

  controller.on = () => {
    if (active) return;
    active = true;
    runInInjectionContext(injector, () => {
      const document = inject(DOCUMENT);
      document.addEventListener(ev, fn as any, listenerOptions);

      controller.off = () => {
        active = false;
        document.removeEventListener(ev, fn as any);
      };
      cleanup(controller.off);
    });
  };

  if (!lazy) controller.on();
  return controller;
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
