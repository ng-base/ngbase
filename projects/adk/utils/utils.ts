import { DOCUMENT } from '@angular/common';
import {
  computed,
  forwardRef,
  inject,
  Injector,
  isSignal,
  linkedSignal,
  runInInjectionContext,
  Signal,
  signal,
  Type,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { cleanup } from './disposals';

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

export interface ListenerOut {
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
      skip?: number;
      element?: HTMLElement | Document | Window;
    }
  > = {},
): ListenerOut {
  const { injector = inject(Injector), lazy = false, element, skip = 0, ...listenerOptions } = data;
  let active = false;
  const controller: ListenerOut = { on: () => {}, off: () => {} };

  controller.on = () => {
    if (active) return;
    active = true;
    runInInjectionContext(injector, () => {
      const el = element || inject(DOCUMENT);
      let eventCount = 0;
      el.addEventListener(
        ev,
        e => {
          eventCount++;
          if (eventCount <= skip) return;
          fn(e as T);
        },
        listenerOptions,
      );

      controller.off = () => {
        active = false;
        eventCount = 0;
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
    key?: keyof T;
    childrenFilter?: (v: T) => V[];
    query?: (v: V, search: string) => boolean;
  },
) {
  const search = signal('');
  const list = linkedSignal(isSignal(data) ? data : signal(data || []));

  const filteredList = computed(() => {
    const text = search().toLowerCase();
    const lists = list();

    const query =
      options.query ?? ((v: V, t: string) => options.filter!(v).toLowerCase().includes(t));
    const vvv = lists.reduce((acc, item) => {
      if (options.childrenFilter) {
        const children = options.childrenFilter(item);
        const filteredChildren = children.filter(child => query(child as unknown as V, text));
        if (filteredChildren.length) {
          acc.push({
            ...item,
            [(options.key as unknown as string) || 'children']: filteredChildren,
          });
        }
      } else if (query(item as unknown as V, text)) {
        acc.push(item);
      }
      return acc;
    }, [] as T[]);
    return vvv;
  });
  return { search, list, filteredList };
}
