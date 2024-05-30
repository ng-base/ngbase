import { DialogInput, DialogOptions, basePortal } from '../portal';
import { Sheet } from './sheet.component';

export function sheetPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, Sheet);

  function open<T>(component: DialogInput, opt?: DialogOptions) {
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
