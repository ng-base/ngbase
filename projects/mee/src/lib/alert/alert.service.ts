import { Alert, AlertOptions } from './alert.component';
import { DialogInput, DialogOptions } from '../portal';
import { dialogPortal } from '../dialog';

export function alertPortal() {
  const base = dialogPortal();

  function open<T>(opt: AlertOptions, comp?: DialogInput<T>) {
    const options: DialogOptions = {
      ...new DialogOptions(),
      data: opt,
      title: opt.title,
      width: '32rem',
      maxWidth: '95vw',
      disableClose: true,
      isHideHeader: true,
    };

    const diaRef = base.open(comp || Alert, options);

    return diaRef;
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
