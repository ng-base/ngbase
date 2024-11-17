import { afterNextRender, DestroyRef, inject, Injector } from '@angular/core';

type Cleanup = () => void;
type CleanupRegisterFn = (fn: Cleanup) => void;

export function disposals() {
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);
  return {
    afterNextRender: (fn: (cleanup: CleanupRegisterFn) => void) => {
      const cleanup: Cleanup[] = [];
      const register = (fn: Cleanup) => cleanup.push(fn);
      const runCleanup = () => cleanup.forEach(c => c());
      afterNextRender(
        () => {
          runCleanup();
          fn(register);
        },
        { injector },
      );
      return destroyRef.onDestroy(() => runCleanup());
    },
  };
}

export function cleanup(fn: () => void) {
  inject(DestroyRef).onDestroy(fn);
}
