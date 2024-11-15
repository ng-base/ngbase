import { DOCUMENT } from '@angular/common';
import {
  computed,
  forwardRef,
  inject,
  Injector,
  isSignal,
  runInInjectionContext,
  Signal,
  signal,
  Type,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { cleanup } from './ng/internals';

export function uniqueId(length: number = 7) {
  return Array.from({ length }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  ).join('');
}

export function provideValueAccessor<T>(valueAccessor: Type<T>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => valueAccessor),
    multi: true,
  };
}

export interface ListnerOut {
  on: () => void;
  off: () => void;
}

export function documentListener<T extends Event>(
  ev: string,
  fn: (e: T) => void,
  data: Partial<
    AddEventListenerOptions & {
      injector?: Injector;
      lazy?: boolean;
      element?: HTMLElement | Document | Window;
    }
  > = {},
): ListnerOut {
  const { injector = inject(Injector), lazy = false, element, ...listenerOptions } = data;
  let active = false;
  const controller: ListnerOut = { on: () => {}, off: () => {} };

  controller.on = () => {
    if (active) return;
    active = true;
    runInInjectionContext(injector, () => {
      const el = element || inject(DOCUMENT);
      el.addEventListener(ev, fn as any, listenerOptions);

      controller.off = () => {
        active = false;
        el.removeEventListener(ev, fn as any);
      };
      cleanup(controller.off);
    });
  };

  if (!lazy) controller.on();
  return controller;
}

export function filterFunction<T, V = T>(
  data: Signal<T[]> | T[],
  options: {
    filter?: (v: V) => string;
    childrenFilter?: (v: T) => V[];
    query?: (v: V, search: string) => boolean;
  },
) {
  const search = signal('');
  const list = isSignal(data) ? data : signal(data || []);

  const filteredList = computed(() => {
    const text = search().toLowerCase();
    const lists = list();

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
