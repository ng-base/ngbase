import { dialogPortal } from '@meeui/ui/dialog';
import { DialogInput, DialogOptions } from '@meeui/adk/portal';
import { Alert, AlertOptions } from './alert';

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
      header: true,
      focusTrap: true,
    };

    const diaRef = base.open(comp || Alert, options);

    return diaRef;
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
