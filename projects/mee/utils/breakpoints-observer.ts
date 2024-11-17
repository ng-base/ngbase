import { signal, WritableSignal } from '@angular/core';
import { isClient } from './ssr';

export function breakpointObserver() {
  const mediaQueryLists = new Map<string, MediaQueryList>();
  const client = isClient();

  /**
   * Observe one or more media queries
   * @param queries Object with query name as key and media query as value
   */
  function observe(queries: Record<string, string>) {
    const breakpointStates = signal<Map<string, boolean>>(new Map());

    if (client) {
      // Initialize states
      mediaQueriesListener(queries, breakpointStates);
    }

    // Return readonly access to breakpoint states
    return breakpointStates.asReadonly();
  }

  function mediaQueriesListener(
    queries: Record<string, string>,
    breakpointStates: WritableSignal<Map<string, boolean>>,
  ) {
    const states = new Map<string, boolean>();

    // Set up listeners for each query
    Object.entries(queries).forEach(([name, query]) => {
      const mediaQueryList = window.matchMedia(query);
      console.log(name, query);

      // Store initial state
      states.set(name, mediaQueryList.matches);

      // Create listener
      const listener = (event: MediaQueryListEvent) => {
        breakpointStates.update(states => {
          states.set(name, event.matches);
          return new Map(states);
        });
      };

      // Add listener and store reference
      mediaQueryList.addEventListener('change', listener);
      mediaQueryLists.set(name, mediaQueryList);
    });

    // Set initial states
    breakpointStates.set(states);
  }

  /**
   * Check if a specific breakpoint query matches
   * @param queryName Name of the query to check
   */
  function matches(queryName: string): boolean {
    if (!client) return false;

    const mediaQueryList = window.matchMedia(queryName);
    return mediaQueryList.matches;
  }

  return { observe, matches };
}
