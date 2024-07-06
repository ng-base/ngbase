import { DialogInput, DialogOptions, basePortal } from '../portal';
import { Drawer } from './drawer.component';

export function drawerPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, Drawer);

  function open<T>(component: DialogInput, opt?: DialogOptions) {
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
