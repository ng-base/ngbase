import { basePortal, DialogInput, DialogOptions } from '@meeui/ui/portal';
import { DialogContainer } from './dialog';

export function dialogPortal() {
  const NAME = 'dialog';
  const base = basePortal(NAME, DialogContainer);

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

export type Dialog = ReturnType<typeof dialogPortal>;
