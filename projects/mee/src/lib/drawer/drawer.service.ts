import { DialogInput, DialogOptions, basePortal } from '../portal';
import { DrawerContainer } from './drawer';

export function drawerPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, DrawerContainer);

  function open<T>(component: DialogInput<T>, opt?: DialogOptions) {
    const { diaRef } = base.open(
      component,
      (comp, options) => {
        comp.instance.setOptions(options);
      },
      opt,
    );

    const { afterClosed } = diaRef;
    return { afterClosed };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}

export type Drawer = ReturnType<typeof drawerPortal>;
