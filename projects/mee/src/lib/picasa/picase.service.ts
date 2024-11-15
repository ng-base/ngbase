import { basePortal, DialogInput, DialogOptions } from '@meeui/ui/portal';
import { PicasaBase } from './picasa-base.component';

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
