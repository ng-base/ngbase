import { DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { isClient } from '@ngbase/adk/utils';

const mediaQueryListeners = new Map<
  string,
  { mql: MediaQueryList; listeners: Set<(event: MediaQueryListEvent) => void> }
>();

export function breakpointObserver() {
  const client = isClient();
  const activeListeners = new Map<any, () => void>();

  function observe<T extends string>(queries: Record<T, string>) {
    const breakpointStates = signal({} as Record<T, boolean>);

    if (client) {
      const cleanup = setupMediaQueries(queries, breakpointStates);
      activeListeners.set(queries, cleanup);
    }

    return {
      state: breakpointStates.asReadonly(),
      unobserve: () => {
        activeListeners.get(queries)?.();
        activeListeners.delete(queries);
      },
    };
  }

  function setupMediaQueries(
    queries: Record<string, string>,
    breakpointStates: WritableSignal<Record<string, boolean>>,
  ) {
    const states = {} as Record<string, boolean>;
    const cleanupFns: Array<() => void> = [];

    Object.entries(queries).forEach(([name, query]) => {
      let queryData = mediaQueryListeners.get(query);

      if (!queryData) {
        const mql = _matchMedia(query);
        if (!mql) return;
        queryData = { mql, listeners: new Set() };
        mediaQueryListeners.set(query, queryData);

        mql.addEventListener('change', event => {
          queryData!.listeners.forEach(listener => listener(event));
        });
      }

      states[name] = queryData.mql.matches;

      const listener = (event: MediaQueryListEvent) => {
        breakpointStates.update(states => ({
          ...states,
          [name]: event.matches,
        }));
      };

      queryData.listeners.add(listener);
      cleanupFns.push(() => {
        queryData!.listeners.delete(listener);
        if (queryData!.listeners.size === 0) {
          queryData!.mql.removeEventListener('change', listener);
          mediaQueryListeners.delete(query);
        }
      });
    });

    breakpointStates.set(states);

    return () => cleanupFns.forEach(fn => fn());
  }

  // cleanup all listeners when the component is destroyed
  inject(DestroyRef).onDestroy(() => {
    activeListeners.forEach(cleanup => cleanup());
  });

  function matches(queryName: string): boolean {
    if (!client) return false;
    return _matchMedia(queryName)?.matches ?? false;
  }

  function _matchMedia(queryName: string) {
    return typeof window.matchMedia !== 'undefined' ? window.matchMedia(queryName) : null;
  }

  return { observe, matches };
}

// This is a mock for testing purposes
export function setupTestBreakpoint(fn: Function) {
  const createMockMediaQuery = () => ({
    matches: false,
    addEventListener: fn(),
    removeEventListener: fn(),
  });

  const _mediaQueryList = createMockMediaQuery();
  const _matchMedia = fn(() => _mediaQueryList);
  window.matchMedia = _matchMedia;

  return {
    reset: () => {
      Object.assign(_mediaQueryList, createMockMediaQuery());
      Object.assign(
        _matchMedia,
        fn(() => _mediaQueryList),
      );
      window.matchMedia = _matchMedia;
    },
    get mediaQueryList() {
      return _mediaQueryList;
    },
    get matchMedia() {
      return _matchMedia;
    },
  };
}
