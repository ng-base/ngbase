import { DialogComponent } from './dialog.component';
import { DialogInput, DialogOptions, basePortal } from '@meeui/portal';

export function dialogPortal() {
  const NAME = 'dialog';
  const base = basePortal(NAME, DialogComponent);

  function open<T>(component: DialogInput, opt?: DialogOptions) {
    const { diaRef } = base.open(component, (comp) => {
      const options = { ...new DialogOptions(), ...opt };
      comp.instance.setOptions(options);
    });

    return diaRef;
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
