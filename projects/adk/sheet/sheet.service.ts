import { basePortal, DialogInput, DialogOptions } from '@ngbase/adk/portal';
import { NgbSheetContainer } from './sheet';

export class SheetOptions extends DialogOptions {
  position?: 'left' | 'right' = 'right';
}

export function ngbSheetPortal(component: typeof NgbSheetContainer) {
  const NAME = 'sheet';
  const base = basePortal(NAME, component);

  function open<T>(component: DialogInput, opt?: SheetOptions) {
    const { diaRef } = base.open(
      component,
      comp => {
        const options = { ...new SheetOptions(), ...opt };
        comp.instance.setOptions(options);
      },
      opt,
    );

    const { afterClosed, close } = diaRef;
    return { afterClosed, close };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}

export type NgbSheet = ReturnType<typeof ngbSheetPortal>;
