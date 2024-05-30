import { PicasaBase } from './picasa-base.component';
import { DialogInput, DialogOptions, basePortal } from '../portal';

export function picasaPortal() {
  const NAME = 'picasa';
  const base = basePortal(NAME, PicasaBase);

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
