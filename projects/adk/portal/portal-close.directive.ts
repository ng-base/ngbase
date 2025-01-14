import { Directive, inject, input } from '@angular/core';
import { DialogRef } from './dialog-ref';

@Directive({
  selector: '[meePortalClose]',
  host: {
    '(click)': 'close()',
  },
})
export class MeePortalClose {
  private readonly dialogRef = inject(DialogRef);
  readonly meePortalClose = input();

  close() {
    this.dialogRef.close(this.meePortalClose());
  }
}
