import { Type } from '@angular/core';
import { DialogOptions, basePortal } from '@meeui/portal';
import { SheetComponent } from './sheet.component';

export function sheetPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, SheetComponent);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const { diaRef } = base.open(
      component,
      (comp) => {
        const options = { ...new DialogOptions(), ...opt };
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
