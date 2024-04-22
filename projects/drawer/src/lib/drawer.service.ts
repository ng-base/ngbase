import { Type } from '@angular/core';
import { DialogOptions, basePortal } from '@meeui/portal';
import { Drawer } from './drawer.component';

export function drawerPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, Drawer);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const { diaRef } = base.open(component, (comp) => {
      const options = { ...new DialogOptions(), ...opt };
      comp.instance.setOptions(options);
    });

    const { afterClosed } = diaRef;
    return { afterClosed };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
