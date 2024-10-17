import { DialogInput, DialogOptions, basePortal } from '../portal';
import { SheetContainer } from './sheet';

export class SheetOptions extends DialogOptions {
  position?: 'left' | 'right' = 'right';
}

export function sheetPortal() {
  const NAME = 'sheet';
  const base = basePortal(NAME, SheetContainer);

  function open<T>(component: DialogInput, opt?: SheetOptions) {
    const { diaRef } = base.open(
      component,
      comp => {
        const options = { ...new SheetOptions(), ...opt };
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

export type Sheet = ReturnType<typeof sheetPortal>;
