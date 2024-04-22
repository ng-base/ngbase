import { Type } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogOptions, basePortal } from '@meeui/portal';

export function dialogPortal() {
  const NAME = 'dialog';
  const base = basePortal(NAME, DialogComponent);

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
