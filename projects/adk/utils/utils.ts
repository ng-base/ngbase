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

export type FilterOptions<T, V = any> = {
  filter: (v: V) => string;
  query?: (query: string, option: V) => boolean;
  key?: keyof T;
  childrenFilter?: (v: T) => V[];
};

export function filterFunction<T, V = T>(data: Signal<T[]> | T[], ops: () => FilterOptions<T, V>) {
  const search = signal('');
  const list = linkedSignal(isSignal(data) ? data : signal(data || []));

  const filteredList = computed(() => {
    const options = ops();
    const text = search()?.trim().toLowerCase() || '';
    const lists = list() || [];
    const filter = options.filter ?? ((v: V) => v as string);

    const query = options.query ?? ((t: string, v: V) => filter(v).toLowerCase().includes(t));
    const vvv = lists.reduce((acc, item) => {
      // Get children from key or childrenFilter
      const children = options.key ? (item[options.key] as V[]) : options.childrenFilter?.(item);
      if (children) {
        const filteredChildren = children?.filter(child => query(text, child as V));
        if (filteredChildren?.length) {
          acc.push({
            ...item,
            [(options.key as unknown as string) || 'children']: filteredChildren,
          });
        }
      } else if (query(text, item as unknown as V)) {
        acc.push(item);
      }
      return acc;
    }, [] as T[]);
    return vvv;
  });
  return { search, list, filteredList };
}
