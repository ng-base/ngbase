import { DialogContainer } from './dialog';
import { MeeDialog, meeDialogPortal } from '@meeui/adk/dialog';

export function dialogPortal() {
  return meeDialogPortal(DialogContainer);
}

export type Dialog = MeeDialog;
