import { basePortal, DialogInput, DialogOptions } from '@ngbase/adk/portal';
import { NgbDialogContainer } from './dialog';

export function ngbDialogPortal(component: typeof NgbDialogContainer) {
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

export type NgbDialog = ReturnType<typeof ngbDialogPortal>;
