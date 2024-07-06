import { Directive, inject, input } from '@angular/core';
import { DialogRef } from './dialog-ref';

@Directive({
  standalone: true,
  selector: '[meeDialogClose]',
  host: {
    '(click)': 'close()',
  },
})
export class DialogClose {
  dialogRef = inject(DialogRef);
  meeDialogClose = input();

  close() {
    this.dialogRef.close(this.meeDialogClose());
  }
}
