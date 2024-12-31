import { basePortal, DialogInput, DialogOptions } from '@meeui/adk/portal';
import { MeeDialogContainer } from './dialog';

export function meeDialogPortal(component: typeof MeeDialogContainer) {
  const NAME = 'dialog';
  const base = basePortal(NAME, component);

  function open<T>(component: DialogInput, opt?: DialogOptions) {
    const { diaRef } = base.open(
      component,
      (comp, options) => {
        comp.instance.setOptions(options);
      },
      opt,
    );

    return diaRef;
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}

export type MeeDialog = ReturnType<typeof meeDialogPortal>;
