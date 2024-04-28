import { Directive, inject } from '@angular/core';
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

  close() {
    this.dialogRef.close();
  }
}
